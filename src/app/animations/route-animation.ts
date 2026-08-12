import{trigger, transition, style, animate}from '@angular/animations';

export const routeAnimation = trigger('routeAnimation',[

    transition('* <=> *',[
        
        // Fade to black
        animate(
          '175ms ease-in',
          style({
            opacity: 0
          })
        ),
    
        // Fade back in
        animate(
          '175ms ease-out',
          style({
            opacity: 1
          })
        )
    
    ])

]);