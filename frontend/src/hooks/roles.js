import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import BASE_URL from "../assets/global/url";

export default function Roles({ children }){
    const [authrztn, setauthrztn] = useState([]);
    useEffect(() => {

    var decoded = jwtDecode(localStorage.getItem('accessToken'));
    console.log("Decoded: ", decoded);


    axios.get(BASE_URL + '/masterList/viewAuthorization/' + decoded.id)
      .then((res) => {
        // console.log("Res: ",res);
        if(res.status === 200){
          console.log("Authorization: ", res.data.userRole.col_authorization);
          setauthrztn(res.data.userRole.col_authorization);
        }
    })
      .catch((err) => {
        console.error(err);
    });

    // console.log("A: ", authrztn)

  }, []);


  return <>{ children(authrztn) }</>
}
