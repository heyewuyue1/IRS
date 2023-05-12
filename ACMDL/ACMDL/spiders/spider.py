import scrapy
from ACMDL.items import AcmdlItem

class MySpider(scrapy.spiders.Spider):
    name = 'article'
    allowed_domains = ['dl.acm.org']
    start_urls =  ['https://dl.acm.org/subject/ai?pageSize=50&sortBy=cited&startPage=%d&EpubDate=%%5B20210511%%20TO%%2020230511%%5D&queryID=34/2F5459999869' % i for i in range(1, 20)]
    def parse(self, response):
        yield from response.follow_all(css="span.hlFld-Title a", callback=self.parse_info)
    
    def parse_info(self, response):
        yield {
            "title": response.css("h1.citation__title::text").get(),
            # response.xpath('//span[@class="content__title--hl"]/text()').extract()[0]
            "pub": response.css("span.epub-section__title::text").get(),
            "date": response.css("span.CitationCoverDate::text").get(),
            "author": response.xpath('//span[@class="loa__author-name"]/span/text()').extract(),
            # "abstract": response.css('div.abstractInFull ::text').extract()[0],
            "abstract": ' '.join(t.strip() for t in response.css('div.abstractInFull ::text').extract()).strip(),
            "url": response.request.url
        }