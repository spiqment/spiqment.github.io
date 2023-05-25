import React, { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { cancelOrder } from "../../../actions/orderActions";
import { AppContext } from "../../../context/AppContext";
import {
  Button,
  Modal,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@material-ui/core";

const CancelOrder = (props) => {
  const dispatch = useDispatch();
  const { alertState } = useContext(AppContext);
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [, setAlert] = alertState;

  const handleClose = () => {
    props.onClose();
  };

  const handleReasonChange = (event) => {
    setReason(event.target.value);
  };

  const handleOtherReasonChange = (event) => {
    setOtherReason(event.target.value);
  };

  const handleCancel = () => {
    const orderStatus = "CANCELLED"
    if (reason === "Others" && otherReason === "") {
      handleClose();
      setAlert({ type: "error", message: "Please Specify your reason of cancellation" });
    }
    else if (reason === ""){
      handleClose();
      setAlert({ type: "error", message: "Please select any reason of cancellation" });
    } else {
        if(reason === "Others"){
          const cancelOrderReason = otherReason;
          dispatch(cancelOrder(props.orderID,{orderStatus, cancelOrderReason}));
          handleClose();
          window.location.reload();
          setAlert({ type: "success", message: "Your Order is cancelled successfully"});
        }
        else{
          const cancelOrderReason = reason;
          dispatch(cancelOrder(props.orderID,{orderStatus, cancelOrderReason}));
          handleClose();
          window.location.reload();
          setAlert({ type: "success", message: "Your Order is cancelled successfully"});
        }
    }
  };
  

  return (
    <Modal
      open={true}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "5px" }}>
        <FormControl component="fieldset">
          <FormLabel component="legend" style={{ color: 'black', marginBottom:"5px", fontSize: '1.7rem', fontWeight: 'bold', fontFamily: 'Lucida Console, Monaco, monospace' }}>Why do you want to cancel this order?</FormLabel>
          <RadioGroup aria-label="reason" name="reason" value={reason} onChange={handleReasonChange}>
            <FormControlLabel value="Change of mind" control={<Radio color="primary" />} label="Change of mind" />
            <FormControlLabel value="Found a better deal elsewhere" control={<Radio color="primary" />} label="Found a better deal elsewhere" />
            <FormControlLabel value="Shipping time too long" control={<Radio color="primary" />} label="Shipping time too long" />
            <FormControlLabel value="Incorrect order details" control={<Radio color="primary" />} label="Incorrect order details" />
            <FormControlLabel value="Mistakenly placed order" control={<Radio color="primary" />} label="Mistakenly placed order" />
            <FormControlLabel value="Others" control={<Radio color="primary" />} label="Others" />
          </RadioGroup>
          {reason === "Others" && (
            <TextField
              label="Other reason"
              variant="outlined"
              margin="normal"
              value={otherReason}
              onChange={handleOtherReasonChange}
              fullWidth
            />
          )}
        </FormControl>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
          <Button variant="outlined" onClick={handleClose} style={{ marginRight: "10px" }}>
            Back
          </Button>
          <Button variant="contained" color="primary" onClick={handleCancel} disabled={reason === "Others" && otherReason === ""}>
            Confirm cancel order
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CancelOrder;
