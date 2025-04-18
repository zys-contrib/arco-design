import React, { PropsWithChildren, useContext, useRef } from 'react';
import { Transition } from 'react-transition-group';
import cs from '../_util/classNames';
import { CollapseContext } from './collapse';
import { ConfigContext } from '../ConfigProvider';
import IconHover from '../_class/icon-hover';
import { CollapseItemProps } from './interface';
import useKeyboardEvent from '../_util/hooks/useKeyboardEvent';

function Item(props: PropsWithChildren<CollapseItemProps>, ref) {
  const { getPrefixCls } = useContext(ConfigContext);
  const divRef = useRef<HTMLDivElement>();
  const ctx = useContext(CollapseContext);
  const getEventListeners = useKeyboardEvent();
  const {
    children,
    name,
    header,
    className,
    style,
    contentStyle,
    extra,
    disabled,
    destroyOnHide,
    expandIcon,
    showExpandIcon = true,
    ...rest
  } = props;

  const prefixCls = getPrefixCls('collapse-item');

  const isExpanded = ctx.activeKeys?.indexOf(name) > -1;
  const icon = showExpandIcon ? ('expandIcon' in props ? expandIcon : ctx.expandIcon) : null;
  const clickEventHandler = (e, regionLevel: 0 | 1 | 2) => {
    if (disabled) return;
    const { triggerRegion } = ctx;
    const triggerRegionLevel = triggerRegion === 'icon' ? 0 : triggerRegion === 'header' ? 1 : 2;
    if (
      regionLevel === triggerRegionLevel ||
      // When triggerRegion is set to header, clicking icon should trigger onChange as well
      (triggerRegion === 'header' && [0, 1].includes(regionLevel))
    ) {
      ctx.onToggle(name, e);
    }
  };

  return (
    <div
      ref={ref}
      {...rest}
      className={cs(
        prefixCls,
        {
          [`${prefixCls}-active`]: isExpanded,
          [`${prefixCls}-no-icon`]: !icon,
          [`${prefixCls}-disabled`]: disabled,
        },
        className
      )}
      style={style}
    >
      <div
        role="button"
        aria-disabled={disabled}
        aria-expanded={isExpanded}
        data-active-region={ctx.triggerRegion}
        tabIndex={disabled ? -1 : 0}
        className={cs(`${prefixCls}-header`, `${prefixCls}-header-${ctx.expandIconPosition}`, {
          [`${prefixCls}-header-disabled`]: disabled,
        })}
        onClick={(e) => clickEventHandler(e, 2)}
        {...getEventListeners({
          onPressEnter: (e) => {
            !disabled && ctx.onToggle(name, e);
          },
        })}
      >
        {icon && (
          <IconHover
            prefix={prefixCls}
            disabled={disabled}
            className={cs({
              [`${prefixCls}-icon-hover-right`]: ctx.expandIconPosition === 'right',
              [`${prefixCls}-header-icon-right`]: ctx.expandIconPosition === 'right',
            })}
            onClick={(e) => clickEventHandler(e, 0)}
          >
            <span
              className={cs(`${prefixCls}-header-icon`, {
                [`${prefixCls}-header-icon-down`]: isExpanded,
              })}
            >
              {icon}
            </span>
          </IconHover>
        )}
        <div className={`${prefixCls}-header-title`} onClick={(e) => clickEventHandler(e, 1)}>
          {header}
        </div>
        {extra && (
          <div
            className={`${prefixCls}-header-extra`}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {extra}
          </div>
        )}
      </div>
      <Transition
        nodeRef={divRef}
        in={isExpanded}
        //  when nodeRef prop is passed, node is not passed, so done is being passed as the first argument.
        addEndListener={(done) => {
          divRef.current?.addEventListener('transitionend', done, false);
        }}
        mountOnEnter={'destroyOnHide' in props ? destroyOnHide : ctx.destroyOnHide || ctx.lazyload}
        unmountOnExit={'destroyOnHide' in props ? destroyOnHide : ctx.destroyOnHide}
        onEnter={() => {
          const e = divRef.current;
          if (e) {
            e.style.height = '0';
            e.style.display = 'block';
          }
        }}
        onEntering={() => {
          const e = divRef.current;
          if (e) {
            e.style.height = `${e.scrollHeight}px`;
          }
        }}
        onEntered={() => {
          const e = divRef.current;
          if (e) {
            e.style.height = 'auto';
          }
        }}
        onExit={() => {
          const e = divRef.current;
          if (e) {
            e.style.display = 'block';
            e.style.height = `${e.offsetHeight}px`;
            // have to trigger reflow to get animation effect on exit
            e.offsetHeight; // eslint-disable-line
          }
        }}
        onExiting={() => {
          const e = divRef.current;
          if (e) {
            e.style.height = '0';
          }
        }}
        onExited={() => {
          const e = divRef.current;

          if (e) {
            e.style.display = 'none';
            e.style.height = 'auto';
          }
        }}
      >
        <div
          role="region"
          className={cs(`${prefixCls}-content`, {
            [`${prefixCls}-content-expanded`]: isExpanded,
          })}
          ref={divRef}
        >
          <div style={contentStyle} className={`${prefixCls}-content-box`}>
            {children}
          </div>
        </div>
      </Transition>
    </div>
  );
}

const ItemRef = React.forwardRef<unknown, PropsWithChildren<CollapseItemProps>>(Item);

ItemRef.displayName = 'CollapseItem';

export default ItemRef;

export { CollapseItemProps };
