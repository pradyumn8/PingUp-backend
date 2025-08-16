import ImageKit from "imagekit";

var imagekit = new ImageKit({
    publicKey :process.env.IMAGEKTI_PUBLIC_KEY,
    privateKey : process.env.IMAGEKTI_PRIVATE_KEY,
    urlEndpoint : process.env.IMAGEKTI_URL_ENDPOINT
});

export default imagekit;