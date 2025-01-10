// NodeData.js

class NodeData {
  constructor({
    uniq_id = '',
    nexts = [],
    type = 'START',
    name = '',
    description = '',
    tool = '',
    true_next = null,
    false_next = null,
  }) {
    this.uniq_id = uniq_id;
    this.nexts = nexts;
    this.type = type;
    this.name = name;
    this.description = description;
    this.tool = tool;
    this.true_next = true_next;
    this.false_next = false_next;
  }

  static fromReactFlowNode(node) {
    return new NodeData({
      uniq_id: node.id,
      nexts: node.data.nexts || [],
      type: node.data.type || 'STEP',
      name: node.data.name,
      description: node.data.description || '',
      tool: node.data.tool || '',
      true_next: node.data.true_next || null,
      false_next: node.data.false_next || null,
    });
  }

  static fromJson(data) {
    return new NodeData(data);
  }

  toReactFlowNode() {
    return {
      id: this.uniq_id,
      type: 'textUpdater',
      data: {
        name: this.name,
        description: this.description,
        nexts: this.nexts,
        type: this.type,
        tool: this.tool,
        true_next: this.true_next,
        false_next: this.false_next,
      },
    };
  }

  toJson() {
    const {
      uniq_id, nexts, type, name, description,
      tool, true_next, false_next,
    } = this;

    return {
      uniq_id,
      nexts,
      type,
      name,
      description,
      tool,
      true_next,
      false_next,
    };
  }
}

export default NodeData;
