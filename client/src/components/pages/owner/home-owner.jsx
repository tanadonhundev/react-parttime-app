import React, { useEffect, useState } from "react";

export default function HomeOwner() {
  const [message, setMessage] = useState("Hello");
  const [message2, setMessage2] = useState("Hello");

  /*useEffect(() => {
    console.log("use effect hook");

    setTimeout(() => {
      setMessage("I'm fine");
    }, 2000);

  });*/

  const onClick = () => {
    setMessage("ssss");
  };

  /*return (
    <>
      <p>{message}</p>
      <button onClick={onClick}>click</button>
    </>
  );*/
}
