import { Box } from "@mui/system";

function Header(props: any) {
  return (
    <Box
      display="flex"
      position="sticky"
      top="0"
      zIndex="999"
      width="100%"
      height="50px"
      bgcolor="#3e3e4d"
    >
      <Box flexGrow="1"></Box>
      <Box display="flex">{props.node}</Box>
    </Box>
  );
}

export default Header;
