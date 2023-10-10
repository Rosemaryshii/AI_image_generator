const generateForm = document.querySelector(".generate-form");
const ImageGallery = document.querySelector(".image-gallery");
 // insert your key here
const OPENAI_API_KEY = "";
let IsImageGenerating = false;

const UpdateImageCard = (ImgDataArray) => {
    ImgDataArray.forEach((imgObject,index) => {
        const imgCard = ImageGallery.querySelectorAll(".image-card")[index];
        const imgElement = imgCard.querySelector("img");
        const DownloadBtn = imgCard.querySelector(".download-btn");

        const AiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = AiGeneratedImg;

        imgElement.onload = () => {
            imgCard.classList.remove("loading");
            DownloadBtn.setAttribute("href",AiGeneratedImg);
            DownloadBtn.setAttribute("download",`${new Date().getTime()}.jpg`);
        }
    });
}

const generateAIImages = async (userprompt,userImageQuantity) => {
    try {
        const response = await fetch("https://api.openai.com/v1/images/generations",{
            method: "POST",

            headers:{
                "content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },

            body: JSON.stringify({
                prompt: userprompt,
                n: parseInt(userImageQuantity),
                size: "512x512",
                response_format: "b64_json"

            })
        });
        if (!response.ok) {
            throw new Error ('Failed to generate images..Please try again');
        }

        const {data} = await response.json();
        UpdateImageCard([...data]);

    } catch (error) {
        alert(error.message);
    }
    finally{
        IsImageGenerating = false;
    }
}

const handleFormSubmission = (e) => {
    e.preventDefault();
    if (IsImageGenerating)return;
    IsImageGenerating = false;
    
    const userprompt = e.srcElement[0].value;
    const userImageQuantity = e.srcElement[1].value;
    const imgCardMarkup = Array.from({length: userImageQuantity},()=>
    
    `<div class="image-card loading">
    <img src="images/loader.svg" alt="image">
    <a href="#" class="download-btn">
        <img src="images/download.svg" alt="download icon">
    </a>
    </div>`
    
    ).join("");
    ImageGallery.innerHTML = imgCardMarkup;
    generateAIImages(userprompt,userImageQuantity);
}
generateForm.addEventListener("submit",handleFormSubmission);