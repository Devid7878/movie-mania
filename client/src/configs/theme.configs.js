import { createTheme } from '@mui/material/styles';
import { colors } from '@mui/material';

export const themeModes = {
	dark: 'dark',
	light: 'light',
};

const themeConfigs = {
	custom: ({ mode }) => {
		const customPalette =
			mode === themeModes.dark
				? {
						primary: {
							main: '#4C9BE6',
							contrastText: '#ffffff',
						},
						secondary: {
							main: '#4C9BE6',
							contrastText: '#ffffff',
						},
						background: {
							default: '#000101',
							paper: '#131313',
						},
				  }
				: {
						primary: {
							main: '#4C9BE6',
						},
						secondary: {
							main: '#4C9BE6',
						},
						background: {
							default: colors.grey['100'],
						},
				  };

		return createTheme({
			palette: {
				mode,
				...customPalette,
			},
			components: {
				MuiButton: {
					defaultProps: { disableElevation: true },
				},
			},
		});
	},
};

export default themeConfigs;
