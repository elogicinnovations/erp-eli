
import axios from 'axios';
import BASE_URL from "../../assets/global/url";
// Function to delete a subpart using Axios
const deleteProduct = () => {
    axios
    .post(`${BASE_URL}/product/deleteOldArchivedProduct`)
    .then((res) => {
        if (res.status === 200) {
            console.log("Successfully deleted product archive");
        } else if (res.status === 201) {
            console.log("No product archive found");
        } else {
            console.log("There seems to be an error product");
        }
    })
    .catch((err) => console.log(err));
};

// Export the function
export default deleteProduct;
