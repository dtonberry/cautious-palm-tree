import ObjectFactory from '../phaser3-rex-plugins/templates/ui/ObjectFactory.js';

import NinePatchFactory from '../phaser3-rex-plugins/templates/ui/ninepatch/Factory.js';
import RoundRectangleFactory from '../phaser3-rex-plugins/templates/ui/roundrectangle/Factory.js';
import RoundRectangleCanvasFactory from '../phaser3-rex-plugins/templates/ui/roundrectanglecanvas/Factory.js';
import BBCodeTextFactory from '../phaser3-rex-plugins/templates/ui/bbcodetext/Factory.js';
import TagTextFactory from '../phaser3-rex-plugins/templates/ui/tagtext/Factory.js';
import ContainerFactory from '../phaser3-rex-plugins/templates/ui/container/Factory.js';
import CanvasFactory from '../phaser3-rex-plugins/templates/ui/canvas/Factory.js';
import CircleMaskImageFactory from '../phaser3-rex-plugins/templates/ui/circlemaskimage/Factory.js';
import DynamicTextFactory from '../phaser3-rex-plugins/templates/ui/dynamictext/Factory.js';
import TextPlayerFactory from '../phaser3-rex-plugins/templates/ui/textplayer/Factory.js';
import CircularProgressCanvasFactory from '../phaser3-rex-plugins/templates/ui/circularprogresscanvas/Factory.js';
import CircularProgressFactory from '../phaser3-rex-plugins/templates/ui/circularprogress/Factory.js';
import KnobFactory from '../phaser3-rex-plugins/templates/ui/knob/Factory.js';
import CustomShapesFactory from '../phaser3-rex-plugins/templates/ui/customshapes/Factory.js';
import CustomProgressFactory from '../phaser3-rex-plugins/templates/ui/customprogress/Factory.js';
import TransitionImageFactory from '../phaser3-rex-plugins/templates/ui/transitionimage/Factory.js';
import FullWindowRectangleFactory from '../phaser3-rex-plugins/templates/ui/fullwindowrectangle/Factory.js';
import CoverFactory from '../phaser3-rex-plugins/templates/ui/cover/Factory.js';
import ChartFactory from '../phaser3-rex-plugins/templates/ui/chart/Factory.js';

import SizerFactory from '../phaser3-rex-plugins/templates/ui/sizer/Factory.js';
import GridSizerFactory from '../phaser3-rex-plugins/templates/ui/gridsizer/Factory.js';
import FixWidthSizerFactory from '../phaser3-rex-plugins/templates/ui/fixwidthsizer/Factory.js';
import OverlapSizerFactory from '../phaser3-rex-plugins/templates/ui/overlapsizer/Factory.js';

import SpaceFactory from '../phaser3-rex-plugins/templates/ui/space/Factory.js';
import LabelFactory from '../phaser3-rex-plugins/templates/ui/label/Factory.js';
import ButtonsFactory from '../phaser3-rex-plugins/templates/ui/buttons/Factory.js';
import GridButtonsFactory from '../phaser3-rex-plugins/templates/ui/gridbuttons/Factory.js';
import FixWidthButtons from '../phaser3-rex-plugins/templates/ui/fixwidthbuttons/Factory.js';
import DialogFactory from '../phaser3-rex-plugins/templates/ui/dialog/Factory.js';
import TabsFactory from '../phaser3-rex-plugins/templates/ui/tabs/Factory.js';
import SliderFactory from '../phaser3-rex-plugins/templates/ui/slider/Factory.js';
import GridTableFactory from '../phaser3-rex-plugins/templates/ui/gridtable/Factory.js';
import MenuFactory from '../phaser3-rex-plugins/templates/ui/menu/Factory.js';
import TextBoxFactory from '../phaser3-rex-plugins/templates/ui/textbox/Factory.js';
import NumberBarFactory from '../phaser3-rex-plugins/templates/ui/numberbar/Factory.js';
import BadgeLabelFactory from '../phaser3-rex-plugins/templates/ui/badgelabel/Factory.js';
import PagesFactory from '../phaser3-rex-plugins/templates/ui/pages/Factory.js';
import TextAreaFactory from '../phaser3-rex-plugins/templates/ui/textarea/Factory.js';
import ScrollablePanelFactory from '../phaser3-rex-plugins/templates/ui/scrollablepanel/Factory.js';
import ToastFactory from '../phaser3-rex-plugins/templates/ui/toast/Factory.js';
import SidesFactory from '../phaser3-rex-plugins/templates/ui/sides/Factory.js';

import ClickFactory from '../phaser3-rex-plugins/templates/ui/click/Factory.js';
import TapFactory from '../phaser3-rex-plugins/templates/ui/tap/Factory.js';
import PressFactory from '../phaser3-rex-plugins/templates/ui/press/Factory.js';
import SwipeFactory from '../phaser3-rex-plugins/templates/ui/swipe/Factory.js';
import PanFactory from '../phaser3-rex-plugins/templates/ui/pan/Factory.js';
import PinchFactory from '../phaser3-rex-plugins/templates/ui/pinch/Factory.js';
import RotateFactory from '../phaser3-rex-plugins/templates/ui/rotate/Factory.js';
import FlipFactory from '../phaser3-rex-plugins/templates/ui/flip/Factory.js';
import TouchEventStopFactory from '../phaser3-rex-plugins/templates/ui/toucheventstop/Factory.js';
import PerspectiveFactory from '../phaser3-rex-plugins/templates/ui/perspective/Factory.js';
import AnchorFactory from '../phaser3-rex-plugins/templates/ui/anchor/Factory.js';

import { GetParentSizer, GetTopmostSizer } from '../phaser3-rex-plugins/templates/ui/utils/GetParentSizer.js';
import IsPointerInBounds from '../phaser3-rex-plugins/plugins/utils/input/IsPointerInBounds.js';
import { Show, Hide, IsShown, } from '../phaser3-rex-plugins/templates/ui/utils/Hide.js';
import { Edit } from '../phaser3-rex-plugins/plugins/textedit.js';
import WrapExpandText from '../phaser3-rex-plugins/templates/ui/utils/wrapexpandtext/WrapExpandText.js';
import { WaitEvent, WaitComplete } from '../phaser3-rex-plugins/templates/ui/utils/WaitEvent.js';
import GetViewport from '../phaser3-rex-plugins/plugins/utils/system/GetViewport.js';
import SetChildrenInteractive from '../phaser3-rex-plugins/templates/ui/utils/setchildreninteractive/SetChildrenInteractive.js';
import { FadeIn, FadeOutDestroy } from '../phaser3-rex-plugins/templates/ui/fade/Fade.js';
import { EaseMoveTo, EaseMoveFrom } from '../phaser3-rex-plugins/templates/ui/easemove/EaseMove.js'
import { Modal, ModalPromise } from '../phaser3-rex-plugins/templates/ui/modal/Modal.js';


class UIPlugin extends Phaser.Plugins.ScenePlugin {
    constructor(scene, pluginManager) {
        super(scene, pluginManager);

        this.add = new ObjectFactory(scene);
    }

    start() {
        var eventEmitter = this.scene.events;
        eventEmitter.on('destroy', this.destroy, this);
    }

    isInTouching(gameObject, pointer, preTest, postTest) {
        if (!gameObject.visible) {
            return false;
        }
        return IsPointerInBounds(gameObject, pointer, preTest, postTest);
    }

    get viewport() {
        return GetViewport(this.scene, true);
    }

}

var methods = {
    getParentSizer: GetParentSizer,
    getTopmostSizer: GetTopmostSizer,
    hide: Hide,
    show: Show,
    isShown: IsShown,
    edit: Edit,
    wrapExpandText: WrapExpandText,
    waitEvent: WaitEvent,
    waitComplete: WaitComplete,
    setChildrenInteractive: SetChildrenInteractive,
    fadeIn: FadeIn,
    fadeOutDestroy: FadeOutDestroy,
    easeMoveTo: EaseMoveTo,
    easeMoveFrom: EaseMoveFrom,
    modal: Modal,
    modalPromise: ModalPromise
}

Object.assign(
    UIPlugin.prototype,
    methods
);


export default UIPlugin;