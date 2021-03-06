
import * as React from 'react';
import styled from 'styled-components';
import Emoji from 'a11y-react-emoji';
function findDomToolTip(count , dom){
    if(count  > 3 || !dom){
        return  null
    }
    if(dom && dom.getAttribute('data-tooltip')){
        return dom
    }
    return findDomToolTip(count , dom.parentElement)
}
export default class UITooltip extends React.Component<any> {
    refToolTip: any = React.createRef()
    handleMouseDown = (e) => {
    }
    handleMouseOver = (e) => {
       e.preventDefault()
        let count = 0
        let dom = findDomToolTip(count , e.target) as HTMLElement ||null
      
        if (dom && dom.getAttribute('data-tooltip')) {
            console.log(dom)
            const text = dom.getAttribute('data-tooltip')
            const domToolTip = this.refToolTip.current
            domToolTip.innerHTML = text 
            const { top, left, width, height } = dom.getBoundingClientRect()
           
            const view = dom.ownerDocument.defaultView
            const scrollTop = view.scrollY
            domToolTip.style.display = "inline-block"
            let leftTooltip  =   left  
            const {width : widthToolTip} = domToolTip.getBoundingClientRect()
            const {height : heightToolTip} = domToolTip.getBoundingClientRect()
            let topTooltip = top + scrollTop -  heightToolTip  ;
            if( left + widthToolTip  > window.innerWidth ) {
              
                leftTooltip = left - (widthToolTip/2)  ;   
                
            }
            if(top - heightToolTip <0) {
                topTooltip  = top  + height 
            }
            domToolTip.style.top = topTooltip  + 'px'
            domToolTip.style.left = leftTooltip +'px'
        }
    }
    handleMouseLeave = (e) => {

        e.stopPropagation()
        const domToolTip = this.refToolTip.current
        domToolTip.style.display = "none"
    }
    render() {
        return <div onMouseDownCapture={this.handleMouseDown}
            onMouseOverCapture={this.handleMouseOver}
            onMouseOutCapture={this.handleMouseLeave}
        >
         <$ToolTip ref={this.refToolTip}  />
            {this.props.children}
        </div>
    }
}

const $ToolTip = styled.div`
    z-index : 999999999999999;
    background-color: #1b1a1a;
    color: white;
    position: absolute;
    padding: 10px;
    border-radius: 10px;
    display : flex;
    width  : auto;
    pointer-events : none;
`