//fonction mettr en forme la date de CreatedAt de MongoDB
export const dateParser = (num) => {
  let option = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  let timeStamp = Date.parse(num);

  let date = new Date(timeStamp).toLocaleDateString("fr-BE", option);

  return date.toString();
};

export const isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
};

//fonction pour mettre en forme le timeStamp des commentaires
export const timeStampParser = (num) => {
  let option = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  let date = new Date(num).toLocaleDateString("fr-BE", option);

  return date.toString();
};
