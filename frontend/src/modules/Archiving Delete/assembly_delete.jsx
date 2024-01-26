import axios from 'axios';
import BASE_URL from "../../assets/global/url";

const deleteAssembly = () => {
    axios
    .post(`${BASE_URL}/assembly/deleteOldArchivedAssembly`)
    .then((res) => {
        if (res.status === 200) {
            console.log("Successfully deleted assembly archive");
        } else if (res.status === 201) {
            console.log("No assembly archive found");
        } else {
            console.log("There seems to be an error in assembly");
        }
    })
    .catch((err) => console.log(err));
};

// Export the function
export default deleteAssembly;
