import React, { useState } from "react";

const TicTacToe = () => {
  const [cases, setCases] = useState(Array(9).fill(""));
  const [tourX, setTourX] = useState(true);

  const handleClick = (index) => {
    if (cases[index] !== "") return; 

    const copie = [...cases];
    copie[index] = tourX ? "X" : "O";
    setCases(copie);
    setTourX(!tourX);
  };

  const reset = () => {
    setCases(Array(9).fill(""));
    setTourX(true);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Tic-Tac-Toe</h2>
      <p>Tour : {tourX ? "X" : "O"}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 60px)", gap: "5px", justifyContent: "center" }}>
        {cases.map((val, index) => (
          <div
            key={index}
            onClick={() => handleClick(index)}
            style={{
              width: "60px",
              height: "60px",
              border: "1px solid black",
              fontSize: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            {val}
          </div>
        ))}
      </div>
      <button onClick={reset} style={{ marginTop: "20px", padding: "10px" }}>
        Recommencer
      </button>
    </div>
  );
};

export default TicTacToe;
