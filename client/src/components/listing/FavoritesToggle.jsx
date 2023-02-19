import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import UserContext from "../../context/UserContext";
import useIsMount from "../../hooks/useIsMount";
import { isDefined, isNullable } from "../../utils/null-checks";

function FavoritesToggle({ id, size, includeText }) {
  const { userData, setGlobalMsg } = useContext(UserContext);

  const decideChecked = () => {
    if (isDefined(userData.user) && userData.user.favorites.includes(id)) {
      return true;
    }
    return false;
  };

  const [checked, setChecked] = useState(decideChecked);
  const isMount = useIsMount();

  useEffect(() => {
    const addToFavorites = () => {
      if (isNullable(userData.user)) {
        setGlobalMsg({
          message: "Privalote prisijungti norėdami įsiminti skelbimą",
          variant: "danger",
        });
        return;
      }

      Axios.post(
        "/api/users/add-to-favorites",
        { id },
        {
          headers: {
            "x-auth-token": localStorage.getItem("auth-token"),
          },
        }
      ).catch((error) => {
        console.error(new Error(error));
      });
    };

    if (!isMount) {
      addToFavorites();
    }
  }, [checked]);

  return (
    <div className="p-2" style={{ cursor: "pointer" }}>
      <input
        type="checkbox"
        checked={checked}
        className="hidden"
        onChange={(e) => setChecked(e.currentTarget.checked)}
        name="cb"
        id="cb"
      />
      <label htmlFor="cb" style={{ cursor: "pointer" }}>
        {checked ? (
          <>
            <svg
              width={size}
              height={size}
              viewBox="0 0 16 16"
              className="bi bi-heart-fill"
              fill="#344767"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
              />
            </svg>
            {includeText && (
              <p className="font-size-medium">Pašalinti iš norų sąrašo</p>
            )}
          </>
        ) : (
          <>
            <svg
              width={size}
              height={size}
              viewBox="0 0 16 16"
              className="bi bi-heart-fill"
              fill="#344767"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
            </svg>
            {includeText && (
              <p className="font-size-medium">Įtraukti į norų sąrašą</p>
            )}
          </>
        )}
      </label>
    </div>
  );
}

export default FavoritesToggle;
