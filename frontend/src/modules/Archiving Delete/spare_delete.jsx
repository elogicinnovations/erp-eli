import axios from 'axios';
import BASE_URL from "../../assets/global/url";

const deleteSpare = () => {
    axios
    .post(`${BASE_URL}/sparePart/deleteOldArchivedSpare`)
    .then((res) => {
        if (res.status === 200) {
            console.log("Successfully deleted spare archive");
        } else if (res.status === 201) {
            console.log("No spare archive found");
        } else {
            console.log("There seems to be an error in spare");
        }
    })
    .catch((err) => console.log(err));
};

// Export the function
export default deleteSpare;
