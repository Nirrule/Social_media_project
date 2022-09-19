import React from "react";
import { useDispatch } from "react-redux";
import { deleteposts } from "../../actions/postAction";

const DeletePostCard = (props) => {
  const dispatch = useDispatch();
  const deleteQuote = () => {
    dispatch(deleteposts(props.id));
  };

  return (
    <div
      onClick={() => {
        if (window.confirm("Voulez vous supprimer ce post ?")) {
          deleteQuote();
        }
      }}
    >
      <img src="./img/icons/trash.svg" alt="trash" />
    </div>
  );
};

export default DeletePostCard;
