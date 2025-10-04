import type { Preview } from '@storybook/react';
import React from 'react';
import '../components/Form/zero.css';
import '../components/Form/FormStyle.css';
import '../components/SelectSearch/style.css';
import '../components/BaseInput/style.css';
import '../components/Checkbox/style.css';

const preview: Preview = {
	parameters: {
		actions: { argTypesRegex: '^on[A-Z].*' },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		docs: {
			toc: true,
		},
	},
	decorators: [
		(Story) => (
			<div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
				<Story />
			</div>
		),
	],
};

export default preview;
