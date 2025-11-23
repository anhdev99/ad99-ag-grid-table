import { extendTheme } from '@mui/joy/styles';

// Custom Joy UI theme with compact sizing
export const compactTheme = extendTheme({
  components: {
    JoyButton: {
      defaultProps: {
        size: 'sm',
      },
    },
    JoyInput: {
      defaultProps: {
        size: 'sm',
      },
    },
  },
});
