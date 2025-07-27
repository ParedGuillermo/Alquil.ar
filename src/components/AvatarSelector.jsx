import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AvatarSelector({ selectedAvatar, onSelect }) {
  const [avatars, setAvatars] = useState([]);
  const bucket = "pets";  // Asegurate que sea el bucket correcto
  const folder = "avatars";

  useEffect(() => {
    const fetchAvatars = async () => {
      const { data, error } = await supabase.storage.from(bucket).list(folder);
      if (error) {
        console.error("Error listando avatares:", error.message);
        return;
      }
      setAvatars(data);
    };
    fetchAvatars();
  }, []);

  const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${bucket}/${folder}`;

  return (
    <div>
      <p className="mb-2 font-semibold">Elegí un avatar:</p>
      <div className="flex flex-wrap gap-4">
        {avatars.map(({ name }) => {
          const url = `${baseUrl}/${name}`;
          return (
            <img
              key={name}
              src={url}
              alt="Avatar"
              className={`w-16 h-16 rounded-full cursor-pointer border-4 ${
                selectedAvatar === url ? "border-blue-600" : "border-transparent"
              }`}
              onClick={() => onSelect(url)}
            />
          );
        })}
      </div>
    </div>
  );
}
