// ============================================================
// Compresse une image côté navigateur avant envoi vers Supabase.
// Objectif : des photos de smartphone (3-8 Mo) tiennent largement
// plus nombreuses dans l'espace de stockage gratuit, sans perte
// visible à l'écran, et sans action supplémentaire pour l'admin.
// ============================================================

function compresserImage(fichier, largeurMax = 1920, qualite = 0.82) {
  return new Promise((resolve, reject) => {
    if (!fichier.type.startsWith('image/') || fichier.type === 'image/gif') {
      resolve(fichier);
      return;
    }

    const image = new Image();
    const lecteur = new FileReader();

    lecteur.onload = () => { image.src = lecteur.result; };
    lecteur.onerror = () => reject(new Error('Lecture du fichier impossible'));

    image.onload = () => {
      let { width, height } = image;
      if (width > largeurMax) {
        height = Math.round((height * largeurMax) / width);
        width = largeurMax;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(image, 0, 0, width, height);

      // Le PNG (et le WebP) peuvent avoir un fond transparent : le JPEG ne
      // supporte pas la transparence et la remplace par du noir. On ne
      // convertit donc en JPEG que les photos qui n'ont pas de transparence
      // à préserver (déjà JPEG), et on garde le PNG sinon.
      const garderTransparence = fichier.type === 'image/png' || fichier.type === 'image/webp';
      const formatSortie = garderTransparence ? 'image/png' : 'image/jpeg';
      const extension = garderTransparence ? '.png' : '.jpg';

      canvas.toBlob(
        (blob) => {
          if (!blob) { resolve(fichier); return; }
          const nomCompresse = fichier.name.replace(/\.[^.]+$/, '') + extension;
          resolve(new File([blob], nomCompresse, { type: formatSortie }));
        },
        formatSortie,
        garderTransparence ? undefined : qualite
      );
    };
    image.onerror = () => reject(new Error('Image illisible'));

    lecteur.readAsDataURL(fichier);
  });
}
