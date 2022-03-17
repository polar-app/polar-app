const Breakpoints = {
	xs: 0,
	sm: 576,
	md: 768,
	lg: 992,
	xl: 1200,
	xxl: 1440,
	xxxl: 1920,
};

function mq(maxWidth: number) {
	return `@media screen and (max-width: ${maxWidth}px)`;
}

export { mq, Breakpoints };
