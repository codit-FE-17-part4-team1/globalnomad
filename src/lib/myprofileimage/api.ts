export async function myprofileimage(imageFile: File) {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await fetch('/api/user/image', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('이미지 업로드 실패', response.status, text);
    throw new Error(`업로드 실패 ${response.status}`);
  }

  const data = await response.json();
  return data.profileImageUrl;
}
