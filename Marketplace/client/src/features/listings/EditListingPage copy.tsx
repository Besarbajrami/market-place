// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import {
//   useUpdateListing,
//   useUploadListingImages,
//   useSetListingCoverImage
// } from "./useMyListings";
// import { useListingForEdit } from "./useListingForEdit";
// import { useListingDetails } from "./useListingDetails";
// import { useCategories } from "../categories/useCategories";
// import { CategoryTreeSelect } from "../categories/CategoryTreeSelect";
// import { useCategoryAttributes } from "../categories/hooks/useCategoryAttributes";
// import {
//   CategoryAttributeType,
//   findCategoryPath
// } from "../categories/categoryTypes";
// import {
//   DynamicAttributesForm,
//   type AttributeValueMap
// } from "./component/DynamicAttributesForm";
// import type { CategoryAttributeDto } from "../categories/getCategoryAttributes";
// import { ListingImagesEditor } from "./ListingImagesEditor";
// import { resolveImageUrl } from "../../shared/utils/resolveImageUrl";
// import { useTranslation } from "react-i18next";

// /* ---------------------------------- */
// /* Types                              */
// /* ---------------------------------- */

// type EditStep = "basics" | "images" | "review";

// type EditImage = {
//   id: string;
//   url: string;
//   isCover: boolean;
// };

// /* ---------------------------------- */
// /* Helpers                            */
// /* ---------------------------------- */

// function formatAttributeValue(
//   attribute: CategoryAttributeDto,
//   value: string
// ) {
//   if (!value) return "";

//   switch (attribute.type) {
//     case CategoryAttributeType.Boolean:
//       return value === "true" ? "Yes" : "No";

//     case CategoryAttributeType.Select:
//       return (
//         attribute.options.find(o => o.value === value)?.label ?? value
//       );

//     default:
//       return value;
//   }
// }

// /* ---------------------------------- */
// /* Component                          */
// /* ---------------------------------- */

// export function EditListingPage() {
//     const { t } = useTranslation();
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const listingId = id!;

//   const update = useUpdateListing();
//   const upload = useUploadListingImages();
//   const setCover = useSetListingCoverImage();

//   const { data: categories } = useCategories();
//   const { data: editData, isLoading } = useListingForEdit(listingId);
//   const { data: details } = useListingDetails(listingId);

//   const [step, setStep] = useState<EditStep>("basics");

//   /* ---------------- Form state ---------------- */

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [currency, setCurrency] = useState("EUR");
//   const [city, setCity] = useState("");
//   const [region, setRegion] = useState("");
//   const [condition, setCondition] = useState("used");
//   const [categoryId, setCategoryId] = useState("");
//   const [images, setImages] = useState<EditImage[]>([]);
//   const [attributeValues, setAttributeValues] =
//     useState<AttributeValueMap>({});

//   const { data: categoryAttributes = [] } =
//     useCategoryAttributes(categoryId || null);

//   const categoryPath =
//     categoryId && categories
//       ? findCategoryPath(categories as any, categoryId)
//       : null;

//   /* ---------------- Init sync ---------------- */

//   useEffect(() => {
//     if (!editData) return;

//     setTitle(editData.title ?? "");
//     setDescription(editData.description ?? "");
//     setPrice(editData.price ? String(editData.price) : "");
//     setCurrency(editData.currency ?? "EUR");
//     setCity(editData.city ?? "");
//     setRegion(editData.region ?? "");
//     setCondition(editData.condition ?? "used");
//     setCategoryId(editData.categoryId ?? "");

//     const map: AttributeValueMap = {};
//     editData.attributes?.forEach(a => {
//       map[a.categoryAttributeId] = a.value;
//     });
//     setAttributeValues(map);
//   }, [editData]);

//   useEffect(() => {
//     if (!details?.images) return;
//     setImages(
//       details.images.map(i => ({
//         id: i.id,
//         url: i.url,
//         isCover: i.isCover
//       }))
//     );
//   }, [details]);

//   /* ---------------- Guards ---------------- */

//   const selectedCategoryIsLeaf = (() => {
//     if (!categoryId || !categories) return false;
  
//     const findNode = (nodes: any[]): any | null => {
//       for (const n of nodes) {
//         if (n.id === categoryId) return n;
//         if (n.children?.length) {
//           const found = findNode(n.children);
//           if (found) return found;
//         }
//       }
//       return null;
//     };
  
//     const node = findNode(categories as any);
//     return !!node && node.children.length === 0;
//   })();
  
//   const canGoToImages =
//     title.trim().length > 0 &&
//     Number(price) > 0 &&
//     !!categoryId &&
//     selectedCategoryIsLeaf;
  

//   const canGoToReview = images.length > 0;

//   /* ---------------- Actions ---------------- */

//   async function onSubmit(e: React.FormEvent) {
//     e.preventDefault();

//     await update.mutateAsync({
//       id: listingId,
//       payload: {
//         categoryId,
//         title,
//         description,
//         price: Number(price),
//         currency,
//         city,
//         region,
//         condition,
//         attributes: Object.entries(attributeValues).map(
//           ([categoryAttributeId, value]) => ({
//             categoryAttributeId,
//             value
//           })
//         )
//       }
//     });

//     navigate("/me/listings");
//   }

//   function onFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
//     const files = Array.from(e.target.files ?? []);
//     if (!files.length) return;

//     upload.mutate(
//       { listingId, files },
//       {
//         onSuccess: uploaded => {
//           setImages(prev => [
//             ...prev,
//             ...uploaded.map(i => ({
//               id: i.imageId,
//               url: i.url,
//               isCover: i.isCover
//             }))
//           ]);
//         }
//       }
//     );
//   }

//   if (isLoading) return <div>{t("common.loading")}</div>
//   ;
//   if (!editData) return <div>{t("common.NotFound")}</div>;

//   /* ---------------------------------- */
//   /* Render                             */
//   /* ---------------------------------- */

//   return (
//     <div style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
//       <h1>Edit Listing</h1>

//       {/* STEPPER */}
//       <Stepper step={step} setStep={setStep} canGoToImages={!!canGoToImages} canGoToReview={canGoToReview} />

//       <form onSubmit={onSubmit}>
//         <Card>
//           {step === "basics" && (
//             <>
//               <Section title="Category">
//                 <CategoryTreeSelect
//                   categories={categories!}
//                   value={categoryId || null}
//                   onChange={setCategoryId}
//                 />
//                 {categoryPath && (
//                   <small>{categoryPath.map(c => c.name).join(" › ")}</small>
//                 )}
//               </Section>

//               <Section title="Listing details">
//                 <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
//                 <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
//               </Section>

//               <Section title="Price & location">
//                 <div style={{ display: "flex", gap: 12 }}>
//                   <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
//                   <select value={currency} onChange={e => setCurrency(e.target.value)}>
//                     <option>EUR</option>
//                     <option>MKD</option>
//                   </select>
//                 </div>
//                 <div style={{ display: "flex", gap: 12 }}>
//                   <input placeholder="City" value={city} onChange={e => setCity(e.target.value)} />
//                   <input placeholder="Region" value={region} onChange={e => setRegion(e.target.value)} />
//                 </div>
//               </Section>

//               {categoryAttributes.length > 0 && (
//                 <Section title="Additional details">
//                   <DynamicAttributesForm
//                     attributes={categoryAttributes}
//                     values={attributeValues}
//                     onChange={setAttributeValues}
//                   />
//                 </Section>
//               )}

//               <PrimaryButton disabled={!canGoToImages} onClick={() => setStep("images")}>
//               {t("common.ContinueToImages")}  
//               </PrimaryButton>
//             </>
//           )}

//           {step === "images" && (
//             <>
//               <Section title="Images">
//                 <input type="file" multiple accept="image/*" onChange={onFilesSelected} />
//                 <ListingImagesEditor
//   images={images}
//   listingId={listingId}
//   setImages={setImages}
//   setCover={setCover}
// />

//               </Section>

//               <PrimaryButton disabled={!canGoToReview} onClick={() => setStep("review")}>
//               {t("common.ContinueToReview")}
//               </PrimaryButton>
//             </>
//           )}

//           {step === "review" && (
//             <>
//               <Section title="Review">
//                 <strong>{title}</strong>
//                 <div>{price} {currency}</div>
//                 <div>{city}, {region}</div>

//                 {categoryAttributes.map(a => {
//                   const v = attributeValues[a.id];
//                   const d = formatAttributeValue(a as any, v);
//                   return d ? <div key={a.id}><strong>{a.label}:</strong> {d}</div> : null;
//                 })}
//               </Section>

//               <PrimaryButton type="submit">{t("common.SaveListing")}</PrimaryButton>
//             </>
//           )}
//         </Card>
//       </form>
//     </div>
//   );
// }

// /* ---------------------------------- */
// /* UI Components                      */
// /* ---------------------------------- */

// function Stepper({ step, setStep, canGoToImages, canGoToReview }: any) {
//     const { t } = useTranslation();

//   return (
//     <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
//       <Step active={step === "basics"} onClick={() => setStep("basics")}>Basics</Step>
//       <Step active={step === "images"} disabled={!canGoToImages} onClick={() => setStep("images")}>{t("common.Images")}</Step>
//       <Step active={step === "review"} disabled={!canGoToReview} onClick={() => setStep("review")}>{t("common.Review")}</Step>
//     </div>
//   );
// }

// function Step({ active, disabled, children, onClick }: any) {
//   return (
//     <button disabled={disabled} onClick={onClick}
//       style={{
//         padding: "10px 18px",
//         borderRadius: 999,
//         border: "1px solid #ccc",
//         background: active ? "#1976d2" : "white",
//         color: active ? "white" : "#222",
//         opacity: disabled ? 0.4 : 1
//       }}>
//       {children}
//     </button>
//   );
// }

// function Card({ children }: any) {
//   return (
//     <div style={{
//       background: "white",
//       borderRadius: 16,
//       padding: 24,
//       boxShadow: "0 12px 30px rgba(0,0,0,0.08)"
//     }}>
//       {children}
//     </div>
//   );
// }

// function Section({ title, children }: any) {
//   return (
//     <div style={{ marginBottom: 24 }}>
//       <h3>{title}</h3>
//       <div style={{ display: "grid", gap: 12 }}>{children}</div>
//     </div>
//   );
// }

// function PrimaryButton({ children, ...props }: any) {
//   return (
//     <button
//       {...props}
//       style={{
//         marginTop: 12,
//         padding: "12px 18px",
//         borderRadius: 10,
//         border: 0,
//         background: "#1976d2",
//         color: "white",
//         fontWeight: 700
//       }}
//     >
//       {children}
//     </button>
//   );
// }

// function ImageGrid({ images, setCover, listingId, setImages }: any) {
//     const { t } = useTranslation();

//   return (
//     <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, 140px)", gap: 12 }}>
//       {images.map((img: EditImage) => (
//         <div key={img.id}>
//           <img src={resolveImageUrl(img.url)} style={{ width: 140, height: 100, objectFit: "cover", borderRadius: 8 }} />
//           {!img.isCover && (
//             <button
//               onClick={() =>
//                 setCover.mutate(
//                   { listingId, imageId: img.id },
//                   {
//                     onSuccess: () =>
//                       setImages((prev: EditImage[]) =>
//                         prev.map(i => ({ ...i, isCover: i.id === img.id }))
//                       )
//                   }
//                 )
//               }
//             >
//               {t("common.SetCover")}
//             </button>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }
