import { ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselItem,
  CarouselContent,
  CarouselPrevious,
  CarouselNext,
} from "./ui/carousel";

export default function Carrousel() {
  return (
    <div className="bg-white ">
      <Carousel className="w-full max-w-7xl mx-auto p-6">
        <CarouselContent>
          <CarouselItem>
            <img
              src="/home/img1.jpg"
              alt="Promo 1"
              className="w-full h-48 sm:h-64 md:h-80 lg:h-[400px] object-cover rounded-lg"
            />
          </CarouselItem>
          <CarouselItem>
            <img
              src="/home/img2.jpg"
              alt="Promo 2"
              className="w-full h-48 sm:h-64 md:h-80 lg:h-[400px] object-cover rounded-lg"
            />
          </CarouselItem>
          <CarouselItem>
            <img 
              src="/home/imagecarousel3.webp" 
              alt="image d'instrument batterie" 
              className="w-full h-48 sm:h-64 md:h-80 lg:h-[400px] object-cover rounded-lg"
            />
          </CarouselItem>
          <CarouselItem>
            <img 
              src="/home/carousel4.webp" 
              alt="image d'instrument batterie" 
              className="w-full h-48 sm:h-64 md:h-80 lg:h-[400px] object-cover rounded-lg"
            />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious size="icon" className="w-12 h-12 cursor-pointer" />
        <CarouselNext size="icon" className="w-12 h-12 cursor-pointer">
          <ArrowRight size={40} />
        </CarouselNext>
      </Carousel>
    </div>
  );
}
