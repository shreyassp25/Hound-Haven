import React from "react";
import { useState } from "react";
import Moment from "react-moment";
import AddMeds from "./Modals/AddMeds";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

const Medications = (props) => {
  //const {isShowing, toggle} = useModal();

  console.log(props);
  const petId = props.petId;
  const [meds, setMeds] = useState(props.meds);
  const [addMed, setAddMed] = useState();
  const [form, setForm] = useState({});
  const [isOpen, setIsOpen] = useState(true);
  const [show, setShow] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [existing, setExisting] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //sort descending so the newest one on the top
  meds.sort(function (a, b) {
    var nameA = a.DueDate,
      nameB = b.DueDate;
    if (nameA < nameB)
      //sort string ascending
      return 1;
    if (nameA > nameB) return -1;
    return 0; //default return value (no sorting)
  });

  const handleAddUpdateMed = async (e, form, cb) => {
    e.preventDefault();
    console.log("from click ", form.addVisitInfo);
    //show the modal dialog
    //get the dialog from the form
    //do the calclations and add the medications

    let medName = form.addMedForm.medication.value;
    let medDate = form.addMedForm.startDate.value;
    // these can be made available if we want the user to add medications that are needed for example monthly
    // let medFreq = form.addMedForm.frequency.value;
    // let medNmDoses = form.addMedForm.numDoses.value;
    let medDose = form.addMedForm.dose.value;

    const vals = {
      MedicationName: medName,
      DueDate: medDate,
      Dose: medDose,
    };

    try {
      console.log("trying", vals);
      let url = `/api/addpetmed/${petId}`;
      console.log(url);
      let resp = await axios.put(url, vals, {
        headers: { "x-auth-token": localStorage.getItem("auth-token") },
      });
      handleClose();
      console.log(resp);
    } catch (err) {
      console.log(err);
      toast.error(err.response);
    }
  };

  const postMed = async (url, vals, petId) => {
    try {
      console.log("trying ", vals);
      console.log(url);
    } catch (err) {
      console.log(err);
    }
  };

  const update = async (e, data) => {
    e.preventDefault();
    setModalData(data);
    setExisting(true);

    console.log("button to update med", data);
  };

  const buttonStyle = {
    backgroundColor: "rgb(255, 100, 100)",
  };

  return (
    <div className="card m-2">
      <div className="card-body text-center ">
        <h3 className="card-title">Medications</h3>
        <div class="pet-table">
          <ul>
            {meds.map((med) => (
              <div
                onClick={(e) => update(e, med)}
                key={med._id}
                className="pet-list card-body"
              >
                <li>{med.MedicationName}</li>
                <li>
                  Next Dose: <Moment format="MM/DD/YYYY">{med.DueDate}</Moment>
                </li>
                <li>{med.Dose}</li>
              </div>
            ))}
          </ul>
        </div>
        <button
          onClick={handleShow}
          style={buttonStyle}
          className=" btn btn-circle btn-xl"
        >
          +
        </button>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AddMeds petId={petId} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={(e) => handleAddUpdateMed(e, document.forms, postMed)}
            >
              Submit Form
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Medications;
