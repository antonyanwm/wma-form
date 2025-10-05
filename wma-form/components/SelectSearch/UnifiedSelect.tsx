import React from 'react';
import { createPortal } from 'react-dom';
import { useFormId } from '../FormProvider';
import { Option, SelectSearchProps } from './types';
import {
	useSelectStoreField,
	useOptionsLoader,
	useOutsideClick,
	useDropdownManager,
	useDropdownPosition,
	useSelectInitialization,
	useSelectHandlers,
	useTagsOverflow,
	useSelectOptions,
	useSelectAccessibility,
} from './hooks';
import './style.css';
import { createEventHandlers } from './utils/eventHandlers';
import { getPlaceholderText, SELECT_TEXTS } from './constants/texts';

const UnifiedSelect = React.forwardRef<HTMLInputElement, SelectSearchProps>((props, ref) => {
	const {
		label,
		name,
		formId: passedFormId,
		loadOptions,
		options,
		placeholder = true,
		required = true,
		className = '',
		validator,
		initialValue = '',
		disabled = false,
		visibleCount = Infinity,
		hideInput = false,
		debounceMs = 250,
		hideErrorOnFocus = true,
		maxLength,
		minLength,
		prefix,
		suffix,
		showDefaultSuffix = true,
		multiple = false,
		maxVisibleItems = 3,
		allowBackspaceDelete = false,
		hideSelectedFromDropdown = false,
		hideClearButton = false,
	} = props;

	// reserved for localization if needed later
	const t = (key: string) => key;

	// Безопасное получение formId из контекста
	let contextFormId: string | null = null;
	try {
		contextFormId = useFormId();
	} catch (error) {
		// Контекст не найден - это нормально, если formId передан явно
	}

	const formId = passedFormId || contextFormId;

	if (!formId) {
		throw new Error('UnifiedSelect: formId is required. Either pass formId prop or use inside Form component.');
	}

	const componentId = `${formId}-${name}`;

	// Refs
	const rootRef = React.useRef<HTMLDivElement>(null);
	const inputRef = React.useRef<HTMLInputElement>(null);
	const listRef = React.useRef<HTMLDivElement>(null);
	const tagsContainerRef = React.useRef<HTMLDivElement>(null);

	// Объединяем внутренний ref с переданным ref
	const combinedInputRef = React.useCallback(
		(node: HTMLInputElement | null) => {
			// Обновляем внутренний ref
			(inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node;

			// Обновляем переданный ref
			if (typeof ref === 'function') {
				ref(node);
			} else if (ref) {
				(ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
			}
		},
		[ref]
	);
	const isFieldRegistered = React.useRef(false);
	const isInitialized = React.useRef(false);

	// Состояние для хранения выбранных опций (для мультиселекта)
	const [selectedOptions, setSelectedOptions] = React.useState<Option[]>([]);

	// Состояние для простого селекта
	const [selectedLabel, setSelectedLabel] = React.useState<string>('');
	const [selectedOption, setSelectedOption] = React.useState<Option | null>(null);

	// Состояние для поискового запроса
	const [query, setQuery] = React.useState('');

	// Состояние для принудительного обновления input
	const [inputKey, setInputKey] = React.useState(0);

	// Store field management
	const { field, setFieldValue, setFieldTouched, setFieldFocused, registerField, validateField, handleClearAll } = useSelectStoreField<Option>(formId, name, {
		formId,
		name,
		multiple,
		setSelectedOptions,
		setSelectedLabel,
		setSelectedOption,
		setQuery,
		isInitialized,
		inputRef,
		setInputKey,
	});

	// Безопасное поле с дефолтными значениями
	const safeField = field || { error: '', focused: false, touched: false, value: '' };

	// Получаем значение из store
	const storeValue = safeField.value ?? (multiple ? [] : '');

	// Подготовка данных для отображения
	const currentValues = multiple ? (Array.isArray(storeValue) ? [...new Set(storeValue.filter((v) => v != null && v !== ''))] : []) : [];
	const currentValue = multiple ? '' : typeof storeValue === 'string' ? storeValue : '';

	// внешний API удален — query управляется только внутри

	// Dropdown management
	const dropdownManager = useDropdownManager({
		componentId,
		multiple,
		setQuery,
	});

	// Регистрируем поле в форме (только один раз при монтировании)
	React.useEffect(() => {
		if (!isFieldRegistered.current) {
			registerField({
				formId,
				name,
				options: {
					type: multiple ? 'multiselect' : 'select',
					required,
					initialValue: multiple ? [] : '', // Всегда пустое - покажем initialValue только после загрузки опций
					validator,
				},
			});
			isFieldRegistered.current = true;
		}
	}, []); // Пустой массив зависимостей - вызывается только один раз при монтировании

	// Options loading
	const {
		loading,
		items: loadedOptions,
		fetchOptions,
		debouncedFetch,
	} = useOptionsLoader({
		loadOptions,
		staticOptions: options,
		hideInput,
		visibleCount,
		debounceMs,
	});

	// Options management
	const { allLoadedOptions, filtered } = useSelectOptions({
		options,
		loadedOptions,
		query,
		visibleCount,
		hideSelectedFromDropdown,
		multiple,
		currentValues,
	});

	// Синхронизация selectedLabel с storeValue для одиночного выбора
	React.useEffect(() => {
		if (!multiple && storeValue && storeValue !== '') {
			const selectedOption = allLoadedOptions.find((opt) => String(opt.value) === String(storeValue));
			if (selectedOption) {
				setSelectedLabel(selectedOption.label);
				setSelectedOption(selectedOption);
			}
		}
	}, [storeValue, allLoadedOptions, multiple, setSelectedLabel]);

	// Очистка внутреннего состояния при внешнем очищении значения (single)
	React.useEffect(() => {
		if (!multiple && (storeValue === '' || storeValue == null)) {
			setSelectedLabel('');
			setSelectedOption(null);
			setQuery('');
			// Принудительно перерисуем инпут, чтобы убрать отображаемый label
			setInputKey((prev) => prev + 1);
		}
	}, [multiple, storeValue, setSelectedLabel, setSelectedOption, setQuery, setInputKey]);

	// Tags overflow management
	const { dynamicMaxVisibleItems, checkTagsOverflowCallback } = useTagsOverflow({
		rootRef,
		currentValues,
		allLoadedOptions,
		maxVisibleItems,
		multiple,
	});

	// Select handlers
	const { handleSelect } = useSelectHandlers({
		formId,
		name,
		multiple,
		storeValue,
		selectedOptions,
		setSelectedOptions,
		setSelectedLabel,
		setSelectedOption,
		setFieldValue,
		setOpen: dropdownManager.setOpen,
		setQuery,
		inputRef,
	});

	// Dropdown position
	const { dropdownPosition } = useDropdownPosition({
		rootRef,
		listRef,
		filtered,
		open: dropdownManager.open,
		multiple,
		checkTagsOverflowCallback,
	});

	// Accessibility
	const { inputId, listId, activeId } = useSelectAccessibility({
		formId,
		name,
		open: dropdownManager.open,
		activeIndex: dropdownManager.activeIndex,
		listRef,
	});

	// Initialization
	useSelectInitialization({
		formId,
		name,
		multiple,
		initialValue,
		allLoadedOptions,
		setSelectedOptions,
		setSelectedLabel,
		setSelectedOption,
		setFieldValue,
		isInitialized,
	});

	// Загружаем опции сразу при монтировании, если есть initialValue
	React.useEffect(() => {
		if (initialValue && loadOptions && allLoadedOptions.length === 0) {
			// Загружаем опции с пустым запросом для получения всех опций
			fetchOptions('', { immediate: true });
		}
	}, [initialValue, loadOptions, allLoadedOptions.length, fetchOptions]);

	// внешний controlled-query удален

	// Обработчики событий
	const eventHandlers = createEventHandlers(
		{
			disabled,
			open: dropdownManager.open,
			query,
			hideInput,
			multiple,
			currentValue,
			storeValue,
			activeIndex: dropdownManager.activeIndex,
			filtered,
			allowBackspaceDelete,
			formId,
			name,
			componentId,
		},
		{ rootRef, inputRef },
		{
			setOpen: dropdownManager.setOpen,
			setQuery,
			setActiveIndex: dropdownManager.setActiveIndex,
			setIsKeyboardNavigation: dropdownManager.setIsKeyboardNavigation,
			setFieldValue,
			setFieldFocused,
			closeAllDropdowns: dropdownManager.closeAllDropdowns,
			fetchOptions,
			handleSelect,
			debouncedFetch,
			setSelectedLabel,
			setSelectedOption,
		}
	);

	const handleBlur = React.useCallback(() => {
		// Не закрываем дропдаун сразу, даем время для клика по опции
		setTimeout(() => {
			// Проверяем, что фокус действительно потерян
			if (!rootRef.current?.contains(document.activeElement)) {
				dropdownManager.setOpen(false);
				setFieldTouched(formId, name, true);
				setFieldFocused(formId, name, false);
				validateField({ formId, name });
				if (multiple) {
					setQuery(''); // Очищаем поисковый запрос при закрытии
				}
			}
		}, 50); // Уменьшили задержку для быстрой навигации Tab
	}, [setFieldTouched, setFieldFocused, validateField, formId, name, multiple, dropdownManager.setOpen]);

	useOutsideClick(dropdownManager.open, [rootRef], () => {
		// Добавляем задержку, чтобы дать время дропдауну открыться
		setTimeout(() => {
			dropdownManager.setOpen(false);
			if (multiple) {
				setQuery('');
			}
		}, 100);
	});

	const translatedPlaceholder = getPlaceholderText(placeholder, multiple);

	// Классы и стили
	const wrapperClass = `select-search-wrapper ${className} ${safeField.error ? 'error' : ''} ${safeField.focused ? 'focused' : ''}`.trim();
	const showError = !hideErrorOnFocus || !safeField.focused;

	// Рендер выбранных элементов для множественного выбора
	const renderSelectedItems = () => {
		if (!multiple) return null;

		const visibleItems = currentValues.slice(0, dynamicMaxVisibleItems);
		const remainingCount = currentValues.length - dynamicMaxVisibleItems;

		return (
			<>
				{visibleItems.length ? (
					<div
						ref={tagsContainerRef}
						className='all-tag-wrapper'>
						{visibleItems.map((value, ind) => {
							const option = allLoadedOptions.find((opt: Option) => String(opt.value) === value);
							return (
								<span
									key={`tag-${value}-${ind}`}
									className='selected-tag'>
									<span className='selected-tag-label'>{option?.label || value}</span>
									<span
										className='selected-tag-remove'
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											handleSelect(option || { label: value, value });
										}}
										onMouseDown={(e) => {
											e.preventDefault();
											e.stopPropagation();
										}}>
										×
									</span>
								</span>
							);
						})}
						{remainingCount > 0 && (
							<span className='placeholder-tag'>
								+{remainingCount} {SELECT_TEXTS.TAGS.MORE}
							</span>
						)}
					</div>
				) : null}
			</>
		);
	};

	return (
		<div
			ref={rootRef}
			className={wrapperClass}>
			{label && <div>{label}</div>}

			{/* Контейнер */}
			<div
				className={`control  ${multiple ? 'multiple' : 'single'} ${dropdownManager.open ? 'focused' : ''} ${disabled ? 'disabled' : ''} ${hideInput ? 'no-input' : ''}`}
				role='combobox'
				aria-haspopup='listbox'
				aria-expanded={dropdownManager.open}
				aria-controls={listId}
				aria-activedescendant={dropdownManager.activeIndex >= 0 ? activeId : undefined}
				onClick={eventHandlers.handleBoxClick}
				onKeyDown={hideInput ? eventHandlers.onKeyDown : undefined}
				tabIndex={hideInput ? 0 : -1}>
				{/* Prefix иконка */}
				{prefix && <div className='prefix-icon'>{prefix}</div>}

				{/* Выбранные элементы (только для multiple) */}
				{renderSelectedItems()}

				{/* Поле ввода (если не скрыто) */}
				<input
					key={`${formId}-${name}-${inputKey}`}
					ref={combinedInputRef}
					id={inputId}
					type='text'
					value={multiple ? query : selectedLabel || query}
					onChange={eventHandlers.handleInput}
					onFocus={eventHandlers.handleFocus}
					onBlur={handleBlur}
					onKeyDown={!hideInput ? eventHandlers.onKeyDown : undefined}
					onClick={(e) => e.stopPropagation()}
					placeholder={multiple ? (currentValues.length === 0 ? translatedPlaceholder : '') : translatedPlaceholder}
					disabled={disabled}
					readOnly={hideInput}
					className={`control-input ${hideInput ? 'input-hidden' : ''}`}
					autoComplete='off'
					maxLength={maxLength}
					minLength={minLength}
				/>

				{/* Кнопка Clear All */}
				{!hideClearButton && ((multiple && currentValues.length > 0) || (!multiple && currentValue)) && (
					<button
						type='button'
						onClick={(e) => {
							e.stopPropagation();
							handleClearAll();
						}}
						className='dropdown-arrow button-clear-all'
						title={SELECT_TEXTS.BUTTONS.CLEAR_ALL}>
						✕
					</button>
				)}

				{/* Suffix иконка или дефолтная стрелка */}
				{suffix !== null && suffix !== undefined ? (
					<div className='suffix-icon'>{suffix}</div>
				) : showDefaultSuffix ? (
					<div className={`suffix-icon default-arrow ${dropdownManager.open ? 'rotated' : ''}`}>▼</div>
				) : null}
			</div>

			{/* Дропдаун */}
			{dropdownManager.open &&
				createPortal(
					<div
						id={listId}
						ref={listRef}
						className='portal-wrap dropdown'
						style={{
							top: dropdownPosition.top,
							left: dropdownPosition.left,
							width: dropdownPosition.width,
						}}
						role='listbox'
						aria-label={label}
						onMouseDown={(e) => e.preventDefault()}
						onMouseEnter={() => {
							// Передаем фокус обратно на контейнер для клавиатурной навигации
							if (rootRef.current) {
								rootRef.current.focus();
							}
						}}
						onMouseMove={() => {
							// Сбрасываем флаг клавиатурной навигации при движении мыши
							dropdownManager.setIsKeyboardNavigation(false);
						}}>
						<div className='list-wrapper'>
							{loading ? (
								<div className='dropdown-loading'>{SELECT_TEXTS.DROPDOWN.LOADING}</div>
							) : filtered.length === 0 ? (
								<div className='dropdown-no-options'>{SELECT_TEXTS.DROPDOWN.NO_OPTIONS}</div>
							) : (
								filtered.map((option: Option, index: number) => {
									const isSelected = multiple ? currentValues.includes(String(option.value)) : currentValue === String(option.value);
									const isActive = index === dropdownManager.activeIndex;

									return (
										<div
											key={option.value}
											data-index={index}
											role='option'
											aria-selected={isSelected}
											id={`option-${formId}-${name}-${index}`}
											aria-activedescendant={isActive ? activeId : undefined}
											onMouseDown={(e) => {
												e.preventDefault();
												e.stopPropagation();
												handleSelect(option);
											}}
											onMouseEnter={() => {
												// Если используется клавиатурная навигация - игнорируем мышь
												if (dropdownManager.isKeyboardNavigation) {
													return;
												}
												// Иначе - разрешаем навигацию мышью
												dropdownManager.setActiveIndex(index);
											}}
											className={`dropdown-option ${isActive ? 'active' : ''} ${isSelected ? 'selected' : ''}`}>
											<span>{option.label}</span>
											{isSelected && <span className='option-checkmark'>✓</span>}
										</div>
									);
								})
							)}
						</div>
					</div>,

					document.body
				)}

			{/* Ошибка */}
			{showError && safeField.error && <div className='error-message'>{safeField.error}</div>}
		</div>
	);
});

UnifiedSelect.displayName = 'UnifiedSelect';

export default UnifiedSelect;
