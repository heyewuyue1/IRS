# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter


class AcmdlPipeline:
    i = 50
    def process_item(self, item, spider):
        dict_item = dict(item)
        file =  open("../papers/" + str(self.i) + ".txt", "x", encoding="utf-8")
        file.write(dict_item['title'] + '\n')
        file.write(", ".join(str(i) for i in dict_item['author']) + '\n')
        file.write(dict_item['pub'] + '\n')
        file.write(dict_item['date'] + '\n')
        file.write(dict_item['abstract'] + '\n')
        file.write(dict_item['url'] + '\n')
        file.close()
        self.i += 1
        return dict_item
