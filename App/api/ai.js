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

// Mock API chatbot AI để trả lời các câu hỏi về thời trang
export async function chatWithAI(message) {
  // Giả lập thời gian xử lý
  await new Promise((res) => setTimeout(res, 800));
  
  const lowerMessage = message.toLowerCase();
  
  // Xử lý các câu hỏi thường gặp
  if (lowerMessage.includes('màu sắc') || lowerMessage.includes('color')) {
    return {
      response: 'Về màu sắc, tôi có thể gợi ý:\n\n• Màu trung tính (đen, trắng, xám) dễ phối với mọi trang phục\n• Màu nóng (đỏ, cam, vàng) tạo cảm giác năng động\n• Màu lạnh (xanh dương, xanh lá, tím) tạo cảm giác bình tĩnh\n• Nên phối tối đa 3 màu trong một outfit',
      suggestions: ['Gợi ý phối màu', 'Màu phù hợp với da', 'Màu theo mùa']
    };
  }
  
  if (lowerMessage.includes('phong cách') || lowerMessage.includes('style')) {
    return {
      response: 'Các phong cách thời trang phổ biến:\n\n• Casual: Thoải mái, phù hợp cuộc sống hàng ngày\n• Formal: Thanh lịch, phù hợp công sở\n• Streetwear: Năng động, phù hợp giới trẻ\n• Vintage: Hoài cổ, độc đáo\n• Minimalist: Tối giản, thanh lịch',
      suggestions: ['Phong cách casual', 'Phong cách công sở', 'Phong cách dự tiệc']
    };
  }
  
  if (lowerMessage.includes('body type') || lowerMessage.includes('dáng người')) {
    return {
      response: 'Dựa trên dáng người, tôi gợi ý:\n\n• Dáng quả táo: Nên mặc áo dài, quần cao eo\n• Dáng quả lê: Nên mặc áo rộng, quần thẳng\n• Dáng đồng hồ cát: Phù hợp với hầu hết trang phục\n• Dáng chữ nhật: Nên tạo đường cong bằng trang phục',
      suggestions: ['Trang phục cho dáng quả táo', 'Trang phục cho dáng quả lê', 'Tạo đường cong']
    };
  }
  
  if (lowerMessage.includes('mùa') || lowerMessage.includes('season')) {
    return {
      response: 'Gợi ý theo mùa:\n\n• Xuân: Màu pastel, áo khoác nhẹ, giày sneaker\n• Hạ: Vải cotton, màu sáng, trang phục thoáng mát\n• Thu: Áo len, màu ấm, giày boot\n• Đông: Áo khoác ấm, màu tối, phụ kiện len',
      suggestions: ['Trang phục mùa hè', 'Trang phục mùa đông', 'Trang phục mùa thu']
    };
  }
  
  if (lowerMessage.includes('gợi ý phối đồ công sở') || lowerMessage.includes('công sở') || lowerMessage.includes('văn phòng')) {
    const suggestions = await suggestOutfitsAI('work');
    let response = 'Đây là gợi ý phối đồ công sở thanh lịch:\n\n';
    
    suggestions.forEach((outfit, index) => {
      response += `${index + 1}. ${outfit.description}\n`;
      outfit.items.forEach(item => {
        response += `   - ${item.type} (${item.color}, ${item.style})\n`;
      });
      response += '\n';
    });
    
    return {
      response,
      suggestions: ['Gợi ý phối đồ dự tiệc', 'Tư vấn màu sắc', 'Phong cách thời trang']
    };
  }
  
  if (lowerMessage.includes('gợi ý phối đồ dự tiệc') || lowerMessage.includes('tiệc') || lowerMessage.includes('dạ hội')) {
    const suggestions = await suggestOutfitsAI('party');
    let response = 'Đây là gợi ý phối đồ dự tiệc sang trọng:\n\n';
    
    suggestions.forEach((outfit, index) => {
      response += `${index + 1}. ${outfit.description}\n`;
      outfit.items.forEach(item => {
        response += `   - ${item.type} (${item.color}, ${item.style})\n`;
      });
      response += '\n';
    });
    
    return {
      response,
      suggestions: ['Gợi ý phối đồ công sở', 'Tư vấn màu sắc', 'Phong cách thời trang']
    };
  }
  
  // Trả lời mặc định
  return {
    response: 'Tôi có thể giúp bạn với:\n\n• Nhận diện trang phục từ ảnh\n• Gợi ý phối đồ theo hoàn cảnh\n• Tư vấn màu sắc và phong cách\n• Gợi ý theo dáng người và mùa\n\nBạn có thể hỏi cụ thể hơn hoặc gửi ảnh để tôi phân tích!',
    suggestions: ['Gợi ý phối đồ', 'Tư vấn màu sắc', 'Phong cách thời trang']
  };
} 