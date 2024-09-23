// types/react-slick.d.ts
declare module 'react-slick' {
    import { ComponentType, ReactNode } from 'react';
  
    interface Settings {
      dots?: boolean;
      infinite?: boolean;
      speed?: number;
      slidesToShow?: number;
      slidesToScroll?: number;
      autoplay?: boolean;
      autoplaySpeed?: number;
      pauseOnHover?: boolean;
      arrows?: boolean;
      prevArrow?: ReactNode;
      nextArrow?: ReactNode;
    }
  
    interface SliderProps {
      settings?: Settings;
      children: ReactNode;
    }
  
    const Slider: ComponentType<SliderProps>;
  
    export default Slider;
  }
  