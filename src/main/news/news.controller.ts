import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/guards/public.decorator';
import { ApiResponse } from 'src/utils/common/apiresponse/apiresponse';

@Public()
@Controller('news')
export class NewsController {
  @Get()
  async getNews() {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=real%20estate&language=es&apiKey=8f1c20ae48a342a68c51bb62a06162fd&pageSize=100`,
      );

      const data = await response.json();
      return data.articles;
    } catch (err) {
      console.error('Error fetching news:', err);
      return ApiResponse.error('Failed to fetch news', err);
    }
  }
}
