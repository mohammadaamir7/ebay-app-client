import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { Typography } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ConfirmationModal = ({ title, open, handleClose, handleSubmit }) => {

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <Typography id="transition-modal-title" variant="h6" component="h2">
            {title}
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 3, ml: 22 }}>
            <Button onClick={handleSubmit} variant="contained" color="error">
              Yes
            </Button>
            <Button onClick={handleClose} variant="contained">
              No
            </Button>
          </Stack>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ConfirmationModal;
