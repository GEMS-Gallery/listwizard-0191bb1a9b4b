import Bool "mo:base/Bool";
import Nat "mo:base/Nat";

import Array "mo:base/Array";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Iter "mo:base/Iter";

actor {
  type ShoppingItem = {
    id: Nat;
    text: Text;
    completed: Bool;
    completedAt: ?Int;
  };

  stable var nextId: Nat = 0;
  stable var items: [(Nat, ShoppingItem)] = [];

  public func addItem(text: Text) : async Nat {
    let id = nextId;
    nextId += 1;
    let newItem: ShoppingItem = {
      id = id;
      text = text;
      completed = false;
      completedAt = null;
    };
    items := Array.append(items, [(id, newItem)]);
    id
  };

  public func toggleItem(id: Nat) : async Bool {
    let itemIndex = Array.indexOf<(Nat, ShoppingItem)>((id, {id=0;text="";completed=false;completedAt=null;}), items, func(a, b) { a.0 == b.0 });
    switch (itemIndex) {
      case null { false };
      case (?index) {
        let (_, item) = items[index];
        let updatedItem = {
          id = item.id;
          text = item.text;
          completed = not item.completed;
          completedAt = if (not item.completed) { ?Time.now() } else { null };
        };
        items := Array.tabulate<(Nat, ShoppingItem)>(items.size(), func (i) {
          if (i == index) { (id, updatedItem) } else { items[i] }
        });
        true
      };
    }
  };

  public func deleteItem(id: Nat) : async Bool {
    let newItems = Array.filter<(Nat, ShoppingItem)>(items, func(item) { item.0 != id });
    if (newItems.size() < items.size()) {
      items := newItems;
      true
    } else {
      false
    }
  };

  public query func getItems() : async [ShoppingItem] {
    Array.map<(Nat, ShoppingItem), ShoppingItem>(items, func((_, item)) { item })
  };
}
