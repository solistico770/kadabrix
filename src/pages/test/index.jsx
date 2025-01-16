import React from "react";

const ArticleCard = () => {
  const cards = 
  [
    {
      "title": "Ut exercitation Ut elit quis incididunt dolor tempor",
      "description": "sit Lorem elit dolor ea dolor magna exercitation minim dolore magna quis amet ad adipiscing eiusmod ullamco ipsum aliqua commodo ex dolore do",
      "image": "https://source.unsplash.com/random/800x600?sig=0",
      "avatar": "https://shadcnblocks.com/images/block/avatar-4.webp",
      "author": "nostrud ut",
      "readTime": "10 Min Read"
    },
    {
      "title": "nisi Lorem ad ex consectetur labore dolore consectetur ad do sit ad",
      "description": "ipsum enim ut ea enim aliqua magna ut dolore incididunt aliqua consequat et dolor consectetur et ea et do do",
      "image": "https://source.unsplash.com/random/800x600?sig=1",
      "avatar": "https://shadcnblocks.com/images/block/avatar-4.webp",
      "author": "ex aliqua",
      "readTime": "10 Min Read"
    },
    {
      "title": "magna sit sit consequat amet Ut labore commodo",
      "description": "consectetur tempor magna elit consectetur consectetur adipiscing et dolor incididunt sed ut ex ullamco",
      "image": "https://source.unsplash.com/random/800x600?sig=2",
      "avatar": "https://shadcnblocks.com/images/block/avatar-4.webp",
      "author": "do elit",
      "readTime": "5 Min Read"
    },
    {
      "title": "dolore consequat laboris do dolor aliquip ad ex Lorem et",
      "description": "sit sit sed elit consequat nostrud dolore aliquip sed ea do aliquip consequat laboris quis ipsum Ut quis ut nisi labore dolore et labore labore",
      "image": "https://source.unsplash.com/random/800x600?sig=3",
      "avatar": "https://shadcnblocks.com/images/block/avatar-5.webp",
      "author": "quis dolore",
      "readTime": "6 Min Read"
    },
    {
      "title": "sed et labore Lorem dolore ex enim",
      "description": "do minim do nisi dolore minim consequat ipsum ea exercitation sit enim quis aliqua laboris ut ullamco ad elit",
      "image": "https://source.unsplash.com/random/800x600?sig=4",
      "avatar": "https://shadcnblocks.com/images/block/avatar-1.webp",
      "author": "tempor magna",
      "readTime": "12 Min Read"
    },
    {
      "title": "dolor incididunt sed exercitation sit Ut enim adipiscing magna aliquip enim ullamco",
      "description": "dolore ea aliqua labore aliqua eiusmod labore laboris sit adipiscing ut do do",
      "image": "https://source.unsplash.com/random/800x600?sig=5",
      "avatar": "https://shadcnblocks.com/images/block/avatar-6.webp",
      "author": "laboris commodo",
      "readTime": "6 Min Read"
    },
    {
      "title": "enim consequat quis quis tempor et ex elit consectetur",
      "description": "ullamco labore ullamco sed commodo do amet adipiscing quis ullamco magna ut dolore amet enim ea consectetur nostrud ut sed dolore Lorem veniam ad",
      "image": "https://source.unsplash.com/random/800x600?sig=6",
      "avatar": "https://shadcnblocks.com/images/block/avatar-1.webp",
      "author": "amet consectetur",
      "readTime": "12 Min Read"
    },
    {
      "title": "tempor adipiscing aliqua magna ut",
      "description": "tempor ad minim ullamco minim Ut laboris ipsum exercitation amet nisi minim tempor labore consequat tempor sed adipiscing ex",
      "image": "https://source.unsplash.com/random/800x600?sig=7",
      "avatar": "https://shadcnblocks.com/images/block/avatar-2.webp",
      "author": "nostrud sed",
      "readTime": "9 Min Read"
    },
    {
      "title": "adipiscing minim quis elit consectetur sit enim Ut",
      "description": "ad laboris do dolore ea sit sit quis eiusmod consequat elit ut nisi aliquip sed incididunt Lorem consectetur eiusmod Lorem Ut et magna",
      "image": "https://source.unsplash.com/random/800x600?sig=8",
      "avatar": "https://shadcnblocks.com/images/block/avatar-2.webp",
      "author": "dolor nisi",
      "readTime": "6 Min Read"
    },
    {
      "title": "Ut aliquip consequat dolore aliqua",
      "description": "consequat aliquip consectetur laboris sed amet ea elit consequat ad Lorem veniam magna enim consequat labore ut",
      "image": "https://source.unsplash.com/random/800x600?sig=9",
      "avatar": "https://shadcnblocks.com/images/block/avatar-2.webp",
      "author": "sed Lorem",
      "readTime": "7 Min Read"
    },
    {
      "title": "ullamco incididunt nostrud quis enim consequat tempor tempor ex ut",
      "description": "ut quis minim exercitation ipsum nisi incididunt ex amet labore ut Ut aliquip tempor exercitation ex ullamco dolore ut nostrud elit labore adipiscing adipiscing adipiscing",
      "image": "https://source.unsplash.com/random/800x600?sig=10",
      "avatar": "https://shadcnblocks.com/images/block/avatar-1.webp",
      "author": "tempor Ut",
      "readTime": "14 Min Read"
    },
    {
      "title": "sed tempor amet exercitation sed incididunt",
      "description": "labore ipsum ipsum ut Ut et Lorem eiusmod nostrud ipsum dolor Ut incididunt ex exercitation ipsum ea enim consectetur veniam dolor adipiscing ex aliquip",
      "image": "https://source.unsplash.com/random/800x600?sig=11",
      "avatar": "https://shadcnblocks.com/images/block/avatar-1.webp",
      "author": "minim laboris",
      "readTime": "6 Min Read"
    }
  ]
  
  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {cards.map((card, index) => (
        <a
          key={index}
          className="rounded-xl border w-[30%] min-w-[280px] max-w-[320px]"
          href="#"
        >
          <div className="p-2">
            <img
              src={card.image}
              alt="placeholder"
              className="aspect-video w-full rounded-lg object-cover"
            />
          </div>
          <div className="px-3 pb-4 pt-2">
            <h2 className="mb-1 font-medium">{card.title}</h2>
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {card.description}
            </p>
            <div
              data-orientation="horizontal"
              role="none"
              className="shrink-0 bg-border h-[1px] w-full my-5"
            ></div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="relative flex shrink-0 overflow-hidden size-9 rounded-full ring-1 ring-input">
                  <img
                    className="aspect-square h-full w-full"
                    alt="placeholder"
                    src={card.avatar}
                  />
                </span>
                <span className="text-sm font-medium">{card.author}</span>
              </div>
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 h-fit">
                {card.readTime}
              </div>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};

export default ArticleCard;
