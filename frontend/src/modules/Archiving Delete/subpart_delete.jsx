import axios from 'axios';
import BASE_URL from "../../assets/global/url";

const deleteSubpart = () => {
    axios
    .post(`${BASE_URL}/subpart/deleteOldArchivedSubParts`)
    .then((res) => {
        if (res.status === 200) {
            console.log("Successfully deleted subpart archive");
        } else if (res.status === 201) {
            console.log("No subpart archive found");
        } else {
            console.log("There seems to be an error in subpart");
        }
    })
    .catch((err) => console.log(err));
};

// Export the function
export default deleteSubpart;
