# react-snap-infinite-carousel
Smooth infinite carousel with css-scroll-snap - implemented with custom animation function

## Example
![](https://s11.gifyu.com/images/S4Wxl.gif)

## Install

```bash
npm install react-snap-infinite-carousel --save

```

If you prefer yarn then

```bash
yarn react-snap-infinite-carousel

```

## Props

| Property         | Type     | Default | Description                                                                                
|------------------|----------|---------|--------------------------------------------------------------------------------------------|
| childern (required)|   React elements     | []      | Words to type                                                                              |
| autoScroll         | boolean   | true     | Auto scroll the carousel                                                             |
| infiniteScroll       | boolean  | true    | Infinite scrolling                                                         |
| interval        | number  | 4    | Time between changing slides in seconds                                            |
| transitionTime    | number   | 1500      | Slide scroll transition time in ms                                                                            |
| easingFunction   | string   | 'ease'      | Animation easing function - 'linear' | 'ease' | 'easeIn' | 'easeOut' | 'easeInOut'                                                                           |




## Usage



```jsx
import React from 'react'
import InfiniteCarousel from 'react-snap-infinite-carousel';


const Example = () => {
  return <InfiniteCarousel>
        <ImgWrapper>
          <div>1</div>
          <Image src={img} alt="" />
        </ImgWrapper>
        <ImgWrapper>
          <div>2</div>
          <Image src={img} alt="" />
        </ImgWrapper>
        <ImgWrapper>
          <div>3</div>
          <Image src={img} alt="" />
        </ImgWrapper>
      </InfiniteCarousel>
}

export default Example;
```

## License

MIT © [mamanico1](https://github.com/mamanico1)


