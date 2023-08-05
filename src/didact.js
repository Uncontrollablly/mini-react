import { isProperty } from "./helpers";

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function createDom(fiber) {
  const dom =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach((prop) => {
      dom[prop] = fiber.props[prop];
    });

  return dom;
}

let nextUnitOfWork = null;
let wipRoot = null;

function commitWork(fiber) {
  if (!fiber) return;

  const parentDom = fiber.parent.dom;
  parentDom.appendChild(fiber.dom);

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function commitRoot() {
  commitWork(wipRoot.child);
  wipRoot = null;
}

function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function performUnitOfWork(fiber) {
  // add dom node
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  // create new fibers
  let prevElement = null;
  fiber.props.children.forEach((element, index) => {
    const newFiber = {
      type: element.type,
      props: element.props,
      dom: null,
      parent: fiber,
    };

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevElement.sibling = newFiber;
    }

    prevElement = newFiber;
  });

  // return next unit of work
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

function render(element, container) {
  wipRoot = {
    type: "ROOT_ELEMENT",
    props: {
      children: [element],
    },
    dom: container,
    parent: null,
  };

  nextUnitOfWork = wipRoot;
}

export const Didact = {
  createElement,
  render,
};
