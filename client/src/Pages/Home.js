import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import AddPet from "../Components/Modals/AddPet";
import UserContext from "../Context/UserContext";
import PetContext from "../Context/PetContext";
import axios from "axios";
import ConfirmDelete from "../Components/Modals/ConfirmDelete";

// import UpcomingAppointments from "../Components/Modals/UpcomingAppoiments";

const Home = () => {
  const { userData } = useContext(UserContext);
  const { newPetData, setNewPetData } = useContext(PetContext);
  const { petId, setPetId } = useContext(PetContext);
  const history = useHistory();
  //const [pets, setUserPets] = useState([]);
  const { pets, setPets } = useContext(PetContext);
  const [user] = useState(userData.user?.id);
  const [petData, setPetData] = useState();
  const displayName = userData.user?.displayName;

  const loadUserPets = async (user) => {
    let url = `/api/getpetbyuser/${user}`;
    try {
      const { data } = await axios.get(url, {
        headers: { "x-auth-token": localStorage.getItem("auth-token") },
      });
      data && setPets(data);
      setNewPetData(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!userData.user) history.push("/login");
  }, [userData.user, history]);

  useEffect(() => {
    user && loadUserPets(user);
  }, [user, newPetData, petId]);

  useEffect(() => {
    petData &&
      history.push({
        pathname: "/petDash",
        state: { info: petData },
      });
  }, [petData, history]);

  const routePet = async (e, id) => {
    // we already had the data no need to go back to the DB
    e.preventDefault();
    let thisPet = pets.filter((pet) => {
      return pet._id === id;
    });
    setPetData(thisPet[0]);
  };

  //map user data and send pets as buttons in list items
  return (
    <>
      <div className="container pets-container">
        <div className="row">
          <div className="col-xs-12 py-5">
            <div className="header-styles">
              <h2 className="myPet-header">{displayName}'s Pets</h2>
            </div>
          </div>
        </div>
        <div className="rounded col-12 home-card">
          <div className="row">
            <div className="col-12 py-5">
              <div>
                {pets.length > 0 &&
                  pets.map((pet, i) => (
                    <div className="row">
                      <div className="user-saved-pets py-1">
                        <button
                          data-bs-toggle="modal"
                          data-bs-target="#confirmDelete"
                          onClick={(e) => {
                            setPetId(pet._id);
                          }}
                          key={i}
                          type="button"
                          className=" delete-pet-btn btn"
                        >
                          <i class="fa fa-minus-circle"></i>
                        </button>
                        <button
                          onClick={(e) => routePet(e, pet._id)}
                          key={pet._id}
                          type="button"
                          className="saved-pet-btn btn btn-floating"
                        >
                          {pet.PetImageLoc ? (
                            <img
                              style={{
                                height: "30px",
                                width: "30px",
                                borderRadius: "100%",
                              }}
                              src={pet.PetImageLoc}
                              alt="pet Image"
                            />
                          ) : (
                            <img
                              style={{
                                height: "30px",
                                width: "30px",
                                borderRadius: "100%",
                              }}
                              src="./images/paw-print-small.png"
                              alt="pet Image"
                            />
                          )}
                          &nbsp;&nbsp;&nbsp;&nbsp;
                          <span>{pet.PetName}</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              {pets.length === 0 && <h2>Click the "+" to add your pets!</h2>}
            </div>
          </div>
          <div className="add-new-pet">
            <button
              data-bs-toggle="modal"
              data-bs-target="#addAPetModal"
              type="button"
              className="add-pet-btn btn btn-circle btn-xl shadow"
            >
              <i class="fa fa-plus"></i>
            </button>
          </div>
        </div>
      </div>
      <ConfirmDelete />
      <AddPet />
    </>
  );
};

export default Home;
