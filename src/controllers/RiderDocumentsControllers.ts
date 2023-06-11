import { PrismaClient, Rider, RiderDocuments } from "@prisma/client";
import { Response, Request } from "express";
import { CheckRiderResult, checkRider } from "../helpers/user";
import { UploadResult, UploadToCloudinary } from "../helpers/Cloudinary";
const prisma = new PrismaClient();

//takes in an array of documents with the document name and the link in base64 format
const images = [
  {
    link: "https://i.pinimg.com/236x/f7/00/da/f700da5beddbe1737f30fa6520d78330.jpg",
    docName: "birth-cert",
  },
  {
    link: "https://i.pinimg.com/236x/12/2a/ee/122aee9a6fd21cfeee9f65518a46e21b.jpg",
    docName: "good conduct",
  },
  {
    link: "https://i.pinimg.com/474x/e2/43/e3/e243e3c9ff79181e51838aa7a6c3a58a.jpg",
    docName: "ID-front",
  },
];
interface Image {
  docName: string;
  imageLink: string;
}
interface Props {
  riderID: string;
  images: Image[];
}
export const RiderDocumentsUpload = async (req: Request, res: Response) => {
  try {
    const images = req.files;
    console.log(images, "images", typeof images);

    const { id } = req.params;
    console.log(id);
    //check rider
    const riderExists = (await checkRider({ id })) as CheckRiderResult;
    if (!riderExists?.riderPresent) {
      res.status(401).json({ message: "rider does not exist" });
      return;
    }
    const rider = riderExists.rider as Rider
    //check whether has documents stored already
    const hasDocuments = (await prisma.riderDocuments.findUnique({
      where: {
        riderId: rider?.id,
      },
    })) as RiderDocuments;
    if (hasDocuments) {
      //update the current docs
      if (Array.isArray(images)) {
        console.log("array");

        for (const image of images) {
          const parts = image.originalname.split(".");
          const docName = parts[0];
          console.log(docName);
          //result object contains {docName, secureUrl}- this will be stored in the db
          const result = (await UploadToCloudinary({
            username: `${rider?.first_name} ${rider?.last_name}`,
            image: image.path,
            userId: rider!.id,
            docName: docName,
          })) as UploadResult;
          console.log(result, "result");
          const secureUrl: string = result.link;
          const documentName: string = result.docName;
          //store secure url in the db
          const doc = (await prisma.riderDocuments.update({
            where: {
              riderId: hasDocuments.riderId,
            },
            data: {
              riderId: rider!.id,
              ...(documentName === "ID_back" && { ID_back: secureUrl }),
              ...(documentName === "ID_front" && { ID_front: secureUrl }),
              ...(documentName === "birth_certificate" && {
                birth_certificate: secureUrl,
              }),
              ...(documentName === "insurance" && { insurance: secureUrl }),
              ...(documentName === "license" && { license: secureUrl }),
              ...(documentName === "good_conduct" && {
                good_conduct: secureUrl,
              }),
            },
          })) as RiderDocuments;
        }

        //upload image to cloudinary
        res.status(200).json({ message: "Images updated successfully" });
      } else {
        res
          .status(400)
          .json({ message: "please provide the images in one array." });
      }
    } else {
      //create new docs for them

      if (Array.isArray(images)) {
        console.log("array");

        for (const image of images) {
          const parts = image.originalname.split(".");
          const docName = parts[0];
          console.log(docName);
          //result object contains {docName, secureUrl}- this will be stored in the db
          const result = (await UploadToCloudinary({
            username: `${rider?.first_name} ${rider?.last_name}`,
            image: image.path,
            userId: rider!.id,
            docName: docName,
          })) as UploadResult;
          console.log(result, "result");
          const documentName: string = result.docName;
          const secureUrl: string = result.link;
          //store secure url in the db
          const doc = (await prisma.riderDocuments.create({
            data: {
              riderId: rider!.id,
              ...(documentName === "ID_back" && { ID_back: secureUrl }),
              ...(documentName === "ID_front" && { ID_front: secureUrl }),
              ...(documentName === "birth_certificate" && {
                birth_certificate: secureUrl,
              }),
              ...(documentName === "insurance" && { insurance: secureUrl }),
              ...(documentName === "license" && { license: secureUrl }),
              ...(documentName === "good_conduct" && {
                good_conduct: secureUrl,
              }),
            },
          })) as RiderDocuments;
        }

        //upload image to cloudinary
        res.status(200).json({ message: "Images uploaded successfully" });
      } else {
        res
          .status(400)
          .json({ message: "please provide the images in one array." });
      }
    }
  } catch (err: any) {
    console.log(err.message);
  }

  //check whether they have docs
};
export const getRiderDocuments = async (req: Request, res: Response) => {
  const { id } = req.params;
  //check rider
  const riderExists = (await checkRider({ id })) as CheckRiderResult;
  if (!riderExists?.riderPresent) {
    res.status(400).json({ message: "No rider with such ID exists" });
    return;
  }
  //check whether docs are available
  const hasDocuments = (await prisma.riderDocuments.findUnique({
    where: {
      riderId: riderExists.rider!.id,
    },
    select: {
      birth_certificate: true,
      ID_back: true,
      ID_front: true,
      good_conduct: true,
      license: true,
      insurance: true,
    },
  })) as RiderDocuments;
  if (hasDocuments) {
    res
      .status(200)
      .json({ message: "documents available", data: hasDocuments });
  } else {
    res.status(400).json({ message: "No documents found" });
  }
};
