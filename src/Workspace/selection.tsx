import * as React from 'react'
import styled from 'styled-components';
import { SubscribeOne } from 'unstated-x';
import workspaceContainer from '../Container/WorkspaceContainer';
import { storeElement } from '../Container/BaseContainer';
import observeRect from '../help/observe-rect';

class Selection extends React.Component<any> {
    state = {
        target : null
    }
    selRef :HTMLElement
    wrapperRef:HTMLElement
    observeObj  = null 
    overRef  :HTMLElement
    updatePosition = async ( ) => {
        const {idSelected} = this.props
        const target = document.querySelector(`[data-element="${idSelected}"]`) as HTMLElement
        if(!this.selRef) return
        this.observeObj  =  observeRect(target , (rect :any) => {
            const {width : widthOb , height : heightOb , top :topOb  , left : leftOb} = rect
            Object.assign(this.selRef.style, { width: widthOb + 'px', height: heightOb + 'px', top: topOb +scrollTop+ 'px', left: leftOb + 'px', display: 'block' })
        })  
        if(!this.observeObj) return
         await this.observeObj.observe()
        if(!target) return
        const type = target.getAttribute('data-type')
        this.overRef.innerHTML = type
        const { width, height, top, left } = target.getBoundingClientRect()
        const scrollTop = window.scrollY
        Object.assign(this.selRef.style, { width: width + 'px', height: height + 'px', top: top +scrollTop+ 'px', left: left + 'px', display: 'block' })
    }
    componentDidUpdate(){
       this.updatePosition()
    }
    componentWillUnmount(){
        console.log('unmout')
        if(this.observeObj){
            this.observeObj.unobserve()
        }
    }
    render() {
        return <SubscribeOne to={workspaceContainer} bind={['selected']}>
            {
                () => {
                    const {selected} = workspaceContainer.state
                    
                    return <$Selection ref={ e => this.selRef = e} >
                    <OverMini ref ={ e => this.overRef= e}></OverMini>
                    </$Selection>
                }
            }
        </SubscribeOne>
    }
}
const OverMini = styled.div`
    background : black;
    color : white;
    display : inline-block;
    padding :2px;
    font-size : 12px;
    border-radius : 4px;
    position: relative;
    top: -30px;
`
const $Selection = styled.div`
    position: absolute;
	box-sizing: border-box;
    border :3px dashed ${props => props.theme.brand.default};
	pointer-events: none;
	/* display: none; */
	z-index: 11;
`
export default Selection