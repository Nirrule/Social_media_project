import React, { useEffect, useState } from "react";
import { UidContext } from "./components/AppContext";
import Routes from "./components/routes";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getUser } from "./actions/userAction";

const App = () => {
  const [uid, setUid] = useState(null);
  const dispatch = useDispatch();

  // on utilise cette fonction pour verifier le token du user
  useEffect(() => {
    const fetchToken = async () => {
      await axios({
        method: "get",
        url: `${process.env.REACT_APP_API_URL}jwtid`,
        withCredentials: true,
      })
        .then((res) => setUid(res.data))
        .catch((err) => console.log("No Token"));
    };
    fetchToken();

    if (uid) dispatch(getUser(uid));
  }, [uid, dispatch]);

  return (
    // ensuite onl'appelle ici et on l'utilise pour englober nos routes afin de pouvoir vérifier
    // si le token est tj présent apres chaque utilisation de du user sur le site
    //!!! utile pour stocker un type de donnée (id user) mais pas pour plsr données
    <UidContext.Provider value={uid}>
      <Routes />
    </UidContext.Provider>
  );
};

export default App;
