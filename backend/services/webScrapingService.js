const axios = require('axios');
const cheerio = require('cheerio');

class WebScrapingService {
  constructor() {
    this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
  }

  /**
   * Scrape Yahoo Finance for stock data
   */
  async scrapeYahooFinance(symbol) {
    try {
      const url = `https://finance.yahoo.com/quote/${symbol}`;
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      
      // Extract key financial data
      const data = {
        symbol: symbol,
        name: $('h1[data-testid="company-name"]').text().trim(),
        currentPrice: this.extractPrice($('fin-streamer[data-field="regularMarketPrice"]').attr('value')),
        change: this.extractPrice($('fin-streamer[data-field="regularMarketChange"]').attr('value')),
        changePercent: $('fin-streamer[data-field="regularMarketChangePercent"]').attr('value'),
        marketCap: $('td[data-testid="MARKET_CAP-value"]').text().trim(),
        volume: $('td[data-testid="TD_VOLUME-value"]').text().trim(),
        peRatio: $('td[data-testid="PE_RATIO-value"]').text().trim(),
        eps: $('td[data-testid="EPS_RATIO-value"]').text().trim(),
        dividend: $('td[data-testid="DIVIDEND_AND_YIELD-value"]').text().trim(),
        high52Week: $('td[data-testid="FIFTY_TWO_WK_HIGH-value"]').text().trim(),
        low52Week: $('td[data-testid="FIFTY_TWO_WK_LOW-value"]').text().trim(),
        timestamp: new Date().toISOString()
      };

      return {
        success: true,
        data: data,
        source: 'Yahoo Finance'
      };

    } catch (error) {
      console.error('Yahoo Finance scraping error:', error.message);
      return {
        success: false,
        error: error.message,
        source: 'Yahoo Finance'
      };
    }
  }

  /**
   * Scrape MarketWatch for financial news and analysis
   */
  async scrapeMarketWatch(symbol) {
    try {
      const url = `https://www.marketwatch.com/investing/stock/${symbol}`;
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      
      // Extract financial data and news
      const data = {
        symbol: symbol,
        name: $('h1.company__name').text().trim(),
        currentPrice: $('.intraday__price .value').text().trim(),
        change: $('.intraday__change .value').text().trim(),
        changePercent: $('.intraday__change .change--percent--q').text().trim(),
        marketCap: $('.kv__item .kv__value').eq(0).text().trim(),
        volume: $('.kv__item .kv__value').eq(1).text().trim(),
        peRatio: $('.kv__item .kv__value').eq(2).text().trim(),
        eps: $('.kv__item .kv__value').eq(3).text().trim(),
        dividend: $('.kv__item .kv__value').eq(4).text().trim(),
        high52Week: $('.kv__item .kv__value').eq(5).text().trim(),
        low52Week: $('.kv__item .kv__value').eq(6).text().trim(),
        news: this.extractNews($),
        analystRatings: this.extractAnalystRatings($),
        timestamp: new Date().toISOString()
      };

      return {
        success: true,
        data: data,
        source: 'MarketWatch'
      };

    } catch (error) {
      console.error('MarketWatch scraping error:', error.message);
      return {
        success: false,
        error: error.message,
        source: 'MarketWatch'
      };
    }
  }

  /**
   * Scrape financial news from MarketWatch
   */
  async scrapeFinancialNews(limit = 10) {
    try {
      const url = 'https://www.marketwatch.com/markets';
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      
      const news = [];
      $('.article__content').slice(0, limit).each((index, element) => {
        const $el = $(element);
        const title = $el.find('.article__headline a').text().trim();
        const link = $el.find('.article__headline a').attr('href');
        const summary = $el.find('.article__summary').text().trim();
        const timestamp = $el.find('.article__timestamp').text().trim();
        
        if (title && link) {
          news.push({
            title,
            summary,
            link: link.startsWith('http') ? link : `https://www.marketwatch.com${link}`,
            timestamp,
            source: 'MarketWatch'
          });
        }
      });

      return {
        success: true,
        data: news,
        source: 'MarketWatch News'
      };

    } catch (error) {
      console.error('Financial news scraping error:', error.message);
      return {
        success: false,
        error: error.message,
        source: 'MarketWatch News'
      };
    }
  }

  /**
   * Scrape crypto data from CoinMarketCap
   */
  async scrapeCryptoData(symbol) {
    try {
      const url = `https://coinmarketcap.com/currencies/${symbol}/`;
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      
      const data = {
        symbol: symbol,
        name: $('h1').text().trim(),
        currentPrice: $('.priceValue').text().trim(),
        change24h: $('.priceValue___3yg7c').text().trim(),
        changePercent24h: $('.priceValue___3yg7c').next().text().trim(),
        marketCap: $('.statsValue___2iaoZ').eq(0).text().trim(),
        volume24h: $('.statsValue___2iaoZ').eq(1).text().trim(),
        circulatingSupply: $('.statsValue___2iaoZ').eq(2).text().trim(),
        maxSupply: $('.statsValue___2iaoZ').eq(3).text().trim(),
        timestamp: new Date().toISOString()
      };

      return {
        success: true,
        data: data,
        source: 'CoinMarketCap'
      };

    } catch (error) {
      console.error('Crypto scraping error:', error.message);
      return {
        success: false,
        error: error.message,
        source: 'CoinMarketCap'
      };
    }
  }

  /**
   * Extract price from string
   */
  extractPrice(priceStr) {
    if (!priceStr) return null;
    return parseFloat(priceStr.replace(/[^0-9.-]/g, ''));
  }

  /**
   * Extract news from MarketWatch page
   */
  extractNews($) {
    const news = [];
    $('.article__content').slice(0, 5).each((index, element) => {
      const $el = $(element);
      const title = $el.find('.article__headline a').text().trim();
      const link = $el.find('.article__headline a').attr('href');
      const summary = $el.find('.article__summary').text().trim();
      
      if (title && link) {
        news.push({
          title,
          summary,
          link: link.startsWith('http') ? link : `https://www.marketwatch.com${link}`,
          timestamp: new Date().toISOString()
        });
      }
    });
    return news;
  }

  /**
   * Extract analyst ratings from MarketWatch page
   */
  extractAnalystRatings($) {
    const ratings = [];
    $('.analyst-ratings .rating').each((index, element) => {
      const $el = $(element);
      const rating = $el.find('.rating__text').text().trim();
      const target = $el.find('.rating__target').text().trim();
      const analyst = $el.find('.rating__analyst').text().trim();
      
      if (rating) {
        ratings.push({
          rating,
          target,
          analyst,
          timestamp: new Date().toISOString()
        });
      }
    });
    return ratings;
  }

  /**
   * Get comprehensive financial data from multiple sources
   */
  async getComprehensiveData(symbol, type = 'stock') {
    try {
      const results = {
        symbol,
        type,
        sources: {},
        timestamp: new Date().toISOString()
      };

      if (type === 'stock') {
        // Get data from Yahoo Finance
        const yahooData = await this.scrapeYahooFinance(symbol);
        results.sources.yahoo = yahooData;

        // Get data from MarketWatch
        const marketWatchData = await this.scrapeMarketWatch(symbol);
        results.sources.marketwatch = marketWatchData;

      } else if (type === 'crypto') {
        // Get crypto data from CoinMarketCap
        const cryptoData = await this.scrapeCryptoData(symbol);
        results.sources.coinmarketcap = cryptoData;
      }

      // Get general financial news
      const newsData = await this.scrapeFinancialNews(5);
      results.sources.news = newsData;

      return {
        success: true,
        data: results
      };

    } catch (error) {
      console.error('Comprehensive data scraping error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = WebScrapingService;
