import NodeCache from "node-cache";

const cache = new NodeCache({
  stdTTL: 60,
  useClones: false
});

export default cache;