// Mock API nhận diện trang phục bằng AI
export async function detectClothesAI(image) {
  // Giả lập thời gian xử lý
  await new Promise((res) => setTimeout(res, 1500));
  // Trả về kết quả mẫu
  return {
    tags: [
      { type: 'Áo thun', color: 'Trắng', style: 'Casual' },
      { type: 'Quần jeans', color: 'Xanh', style: 'Street' },
      { type: 'Giày sneaker', color: 'Đen', style: 'Sporty' },
    ],
  };
}

// Mock API gợi ý phối đồ bằng AI
export async function suggestOutfitsAI(context) {
  // Giả lập thời gian xử lý
  await new Promise((res) => setTimeout(res, 1200));
  // Trả về danh sách outfit mẫu
  if (context === 'work') {
    return [
      {
        id: 1,
        description: 'Outfit công sở thanh lịch',
        items: [
          { type: 'Áo sơ mi', color: 'Trắng', style: 'Formal' },
          { type: 'Quần tây', color: 'Đen', style: 'Formal' },
          { type: 'Giày da', color: 'Nâu', style: 'Formal' },
        ],
        image: 'https://i.imgur.com/1Q9Z1Zm.png',
      },
    ];
  } else if (context === 'party') {
    return [
      {
        id: 2,
        description: 'Outfit dự tiệc sang trọng',
        items: [
          { type: 'Đầm dạ hội', color: 'Đỏ', style: 'Elegant' },
          { type: 'Giày cao gót', color: 'Đen', style: 'Elegant' },
        ],
        image: 'https://i.imgur.com/2Q9Z1Zm.png',
      },
    ];
  } else {
    return [
      {
        id: 3,
        description: 'Outfit đi chơi năng động',
        items: [
          { type: 'Áo thun', color: 'Xanh', style: 'Casual' },
          { type: 'Quần short', color: 'Be', style: 'Casual' },
          { type: 'Giày sneaker', color: 'Trắng', style: 'Sporty' },
        ],
        image: 'https://i.imgur.com/3Q9Z1Zm.png',
      },
    ];
  }
}

// Mock API tạo ảnh mặc thử outfit bằng AI
export async function tryOnOutfitAI(portraitImage, outfit) {
  // Giả lập thời gian xử lý
  await new Promise((res) => setTimeout(res, 1800));
  // Trả về link ảnh kết quả mẫu (ảnh minh họa random)
  return {
    resultImage: 'https://i.imgur.com/4Q9Z1Zm.png',
    // Có thể trả về thêm thông tin nếu cần
  };
} 