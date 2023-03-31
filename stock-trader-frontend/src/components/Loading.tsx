import { autocompleteClasses, CircularProgress } from "@mui/material";
import { Box } from "@mui/system";

function Loading() {
  return (
    <Box
      display="flex"
      position="fixed"
      justifyContent="center"
      zIndex="9999"
      width="100%"
      height="100%"
      bgcolor="#d4d4d480"
    >
      <CircularProgress sx={{ margin: "auto" }} size="50px" />
    </Box>
  );
}

export default Loading;
