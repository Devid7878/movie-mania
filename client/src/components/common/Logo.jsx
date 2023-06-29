import { Typography, useTheme } from '@mui/material';

const Logo = () => {
	const theme = useTheme();

	return (
		<Typography fontWeight='700' fontSize='1.0rem'>
			Movie<span style={{ color: theme.palette.primary.main }}>Mania</span>
		</Typography>
	);
};

export default Logo;
