// This component is no longer needed as the application will default to Indonesian.
// "use client";

// import React from "react";
// import { useTranslation } from "react-i18next";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// const LanguageSwitcher: React.FC = () => {
//   const { i18n } = useTranslation();

//   const changeLanguage = (lng: string) => {
//     i18n.changeLanguage(lng);
//   };

//   return (
//     <Select onValueChange={changeLanguage} defaultValue={i18n.language}>
//       <SelectTrigger className="w-[100px] h-9">
//         <SelectValue placeholder="Language" />
//       </SelectTrigger>
//       <SelectContent>
//         <SelectItem value="id">Bahasa Indonesia</SelectItem>
//         <SelectItem value="en">English</SelectItem>
//       </SelectContent>
//     </Select>
//   );
// };

// export default LanguageSwitcher;