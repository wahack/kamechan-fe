import React, { useEffect } from 'react';
import { Input, Card, Popover, PopoverTrigger, PopoverContent, Divider } from '@heroui/react';
import { Icon } from '@iconify/react';
import { Button } from '@heroui/react';
import { requestApi } from '@/app/_utils/request';

interface NodeDocument {
  id: string;
  name: string;
  summary: string;
  params: { label: string, value: string }[];
  icon: string;
}

export const NodeDocSearch: React.FC<{
  onSelectDoc?: (doc: NodeDocument) => void
}> = ({
  onSelectDoc
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [documents, setDocuments] = React.useState<NodeDocument[]>();
  const [isLoading, setIsLoading] = React.useState(false);

  async function onSearch() {
    const query = searchQuery.trim();
    setIsLoading(true);
    try {
      const { data } = await requestApi.get('/api/search-doc?keyword=' + query);
      setDocuments(data.data)
      // setSearchQuery('')
    } catch (e) {

    }
    setIsLoading(false)
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (isLoading) return;
      onSearch();
    }
  };
  useEffect(() => {
    onSearch()
  }, [])

  return (
    <Card
      className="w-full h-full border-none rounded-none shadow-none overflow-hidden"
      radius="none"
    >
      <div className="w-full h-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm overflow-y-auto flex flex-col border-r border-gray-100 dark:border-gray-700">
        <div className="p-4 bg-gradient-to-r from-accent-blue/10 to-accent-purple/5 dark:from-accent-blue/20 dark:to-accent-purple/10 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-sm font-semibold mb-3 text-gray-800 dark:text-gray-100 flex items-center">
            <Icon icon="teenyicons:doc-outline" className="mr-2 text-accent-blue" />
            Services integrated
          </h2>
          <div className="relative">
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              onKeyDown={handleKeyDown}
              size="sm"
              className="mb-1 bg-transparent dark:bg-gray-700 shadow-sm"
              startContent={<Icon icon="icon-park-outline:hand-right" className="text-gray-400 text-sm" />}
            />
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <Button
                isIconOnly
                size="sm"
                radius='none'
                variant="light"
                isLoading={isLoading}
                onPress={onSearch}
                className="bg-accent-blue/10 dark:bg-accent-blue/20 text-accent-blue"
              >
                <Icon icon="lucide:search" className="text-sm" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-0">
          {documents && documents.length > 0 ? (
            documents.map((doc, index) => (
              <React.Fragment key={doc.id}>
                <Popover placement="right">
                  <PopoverTrigger>
                    <div className="p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-left">
                      <div className="flex items-start">
                        <div className="mr-3 mt-0.5">
                          <img
                            src={doc.icon}
                            alt={doc.name}
                            className="w-5 h-5 object-cover rounded-sm"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
                            {doc.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                            {doc.summary}
                          </p>
                        </div>
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 items-left">
                    <div className="px-1 py-2">
                      <div className="flex items-left justify-between gap-2 mb-2">
                        <div className="flex items-left gap-2">
                          <img
                            src={doc.icon}
                            alt={doc.name}
                            className="w-5 h-5 object-cover rounded-sm"
                          />
                          <div className="text-small font-bold">{doc.name}</div>
                        </div>
                        <div>
                        <Button
                          size="sm"
                          variant="light"
                          className="text-blue-500 px-2 min-w-0 h-6"
                          onPress={() => onSelectDoc && onSelectDoc(doc)}
                        >
                          Use
                        </Button>
                        <Button
                          size="sm"
                          variant="light"
                          className="text-pink px-2 min-w-0 h-6"
                        >
                          Ask AI
                        </Button>
                        </div>
                        
                      </div>
                      {/* List of document details with label-value pairs */}
                      <div className="max-h-[280px] overflow-y-auto pr-1">
                        <div className="text-sm mb-4 text-primary dark:text-gray-300 whitespace-pre-wrap">
                          {doc.summary}
                        </div>
                        {doc.params && (
                          <div className="space-y-3">
                            {doc.params.map((detail, idx) => (
                              <div key={idx} className="text-left">
                                <div className="flex items-baseline mb-1">
                                  {/* <div className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-2 flex-shrink-0 mt-1"></div> */}
                                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300 break-words overflow-hidden text-ellipsis">
                                    {detail.label}
                                  </div>
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-2 rounded max-h-[100px] overflow-y-auto overflow-x-hidden whitespace-pre-wrap break-all">
                                  {detail.value}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                {/* Add divider between items except after the last item */}
                {index < documents.length - 1 && (
                  <Divider className="my-0 opacity-50" />
                )}
              </React.Fragment>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400 dark:text-gray-500">
              <Icon icon="lucide:file-question" className="mb-2 text-2xl" />
              <p className="text-xs">No service found</p>
            </div>
          )}
        </div>

        <div className="p-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center text-xs text-primary dark:text-primary-500">
            <Icon icon="lucide:plus-circle" className="mr-1" />
            <span>Request new features</span>
          </div>
        </div>
      </div>
    </Card>
  );
};