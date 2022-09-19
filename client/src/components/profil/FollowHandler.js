import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { followUser, unfollowUser } from "../../actions/userAction";
import { isEmpty } from "../Utils";

const FollowHandler = ({ idToFollow, type }) => {
  const userData = useSelector((state) => state.rootReducer.userReducer);
  const [isFollowed, setIsFollowed] = useState(false);
  const dispatch = useDispatch();

  const handleFollow = () => {
    dispatch(followUser(userData._id, idToFollow));
    setIsFollowed(true);
  };

  const handleUnfollow = () => {
    //on met idToFollow car cela reprend l'id de la personne qu'on veut (parametre de la fonction) mais c'est idToUnfollow
    //dans le back et dans le reducer
    dispatch(unfollowUser(userData._id, idToFollow));
    setIsFollowed(false);
  };

  //   le useEffect ici sert à vérifier si on suit ou pas les personnes et de relancer la fonction en cas de changement
  useEffect(() => {
    // le premier if sert à voir si le champ des personnes suivi est vide (voir utils => isEmpty)
    if (!isEmpty(userData.following)) {
      //ensuite on vérifie si on suit déjà l'id qui suit (idToFollow)
      if (userData.following.includes(idToFollow)) {
        setIsFollowed(true);
        //sinon on le suit pas donc c'est false
      } else setIsFollowed(false);
    }
  }, [userData, idToFollow]);
  // on met un call back avec le [] pour qu'il termine l'action et à l'intérieur on met userData
  // pour qu'a chaque fois que le userData evolue, on relance la fonction

  return (
    <>
      {isFollowed && !isEmpty(userData) && (
        <span onClick={handleUnfollow}>
          {type === "suggestion" && (
            <button className="unfollow-btn">Abonné</button>
          )}
          {type === "card" && (
            <img src="./img/icons/checked.svg" alt="checked" />
          )}
        </span>
      )}
      {isFollowed === false && !isEmpty(userData) && (
        <span onClick={handleFollow}>
          {type === "suggestion" && (
            <button className="follow-btn">suivre</button>
          )}
          {type === "card" && <img src="./img/icons/check.svg" alt="check" />}
        </span>
      )}
    </>
  );
};

export default FollowHandler;
