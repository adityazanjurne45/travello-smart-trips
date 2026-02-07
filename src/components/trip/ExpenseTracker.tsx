import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Wallet, Plus, Trash2, UtensilsCrossed, Hotel, Car, Ticket, ShoppingBag, MoreHorizontal
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  { value: "food", label: "Food", icon: UtensilsCrossed, color: "text-amber-500" },
  { value: "hotel", label: "Hotel", icon: Hotel, color: "text-blue-500" },
  { value: "transport", label: "Transport", icon: Car, color: "text-green-500" },
  { value: "tickets", label: "Tickets", icon: Ticket, color: "text-purple-500" },
  { value: "shopping", label: "Shopping", icon: ShoppingBag, color: "text-pink-500" },
  { value: "other", label: "Other", icon: MoreHorizontal, color: "text-muted-foreground" },
] as const;

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  created_at: string;
}

interface ExpenseTrackerProps {
  tripId: string;
  budget: number;
}

export function ExpenseTracker({ tripId, budget }: ExpenseTrackerProps) {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState("food");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("expenses")
      .select("*")
      .eq("trip_id", tripId)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setExpenses(data);
        setLoading(false);
      });
  }, [tripId, user]);

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = budget - totalSpent;
  const percentage = Math.min((totalSpent / budget) * 100, 100);
  const isOverBudget = totalSpent > budget;
  const isNearBudget = percentage >= 80 && !isOverBudget;

  const categoryTotals = CATEGORIES.map(cat => ({
    ...cat,
    total: expenses.filter(e => e.category === cat.value).reduce((s, e) => s + e.amount, 0),
  }));

  const addExpense = async () => {
    if (!user || !description.trim() || !amount) return;
    const amountNum = parseInt(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    const { data, error } = await supabase
      .from("expenses")
      .insert({ trip_id: tripId, user_id: user.id, category, description: description.trim(), amount: amountNum })
      .select()
      .single();

    if (error) {
      toast.error("Failed to add expense");
      return;
    }
    setExpenses([data, ...expenses]);
    setDescription("");
    setAmount("");
    setShowForm(false);
    toast.success("Expense added");
  };

  const deleteExpense = async (id: string) => {
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (!error) {
      setExpenses(expenses.filter(e => e.id !== id));
      toast.success("Expense removed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
            <Wallet className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold">Budget Tracker</h2>
            <p className="text-sm text-muted-foreground">Track your trip spending</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 rounded-xl bg-muted/50">
            <p className="text-xs text-muted-foreground mb-1">Budget</p>
            <p className="text-lg font-bold text-foreground">₹{budget.toLocaleString()}</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-muted/50">
            <p className="text-xs text-muted-foreground mb-1">Spent</p>
            <p className={`text-lg font-bold ${isOverBudget ? "text-destructive" : "text-primary"}`}>
              ₹{totalSpent.toLocaleString()}
            </p>
          </div>
          <div className="text-center p-3 rounded-xl bg-muted/50">
            <p className="text-xs text-muted-foreground mb-1">Remaining</p>
            <p className={`text-lg font-bold ${isOverBudget ? "text-destructive" : "text-foreground"}`}>
              ₹{remaining.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{percentage.toFixed(0)}% used</span>
            {isOverBudget && <span className="text-destructive font-medium">Over budget!</span>}
            {isNearBudget && <span className="text-amber-500 font-medium">Almost there!</span>}
          </div>
          <Progress 
            value={percentage} 
            className={`h-3 ${isOverBudget ? "[&>div]:bg-destructive" : isNearBudget ? "[&>div]:bg-amber-500" : ""}`} 
          />
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <h3 className="font-display font-semibold mb-4">By Category</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {categoryTotals.map(cat => (
            <div key={cat.value} className="text-center p-3 rounded-xl bg-muted/50">
              <cat.icon className={`w-5 h-5 mx-auto mb-1 ${cat.color}`} />
              <p className="text-xs text-muted-foreground">{cat.label}</p>
              <p className="text-sm font-semibold text-foreground">₹{cat.total.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Expense */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold">Expenses</h3>
          <Button size="sm" onClick={() => setShowForm(!showForm)} className="gap-1">
            <Plus className="w-4 h-4" /> Add
          </Button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 rounded-xl bg-muted/50 mb-4 space-y-3">
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.value}
                      onClick={() => setCategory(cat.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        category === cat.value
                          ? "gradient-primary text-primary-foreground"
                          : "bg-background border border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
                <Input
                  placeholder="Description (e.g., Lunch at cafe)"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  maxLength={100}
                />
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Amount (₹)"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    min={1}
                    className="flex-1"
                  />
                  <Button onClick={addExpense} className="gradient-primary">Save</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expense List */}
        {loading ? (
          <p className="text-center text-muted-foreground text-sm py-4">Loading...</p>
        ) : expenses.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-6">No expenses yet. Start tracking!</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {expenses.map(expense => {
              const cat = CATEGORIES.find(c => c.value === expense.category) || CATEGORIES[5];
              return (
                <div key={expense.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <cat.icon className={`w-4 h-4 shrink-0 ${cat.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{expense.description}</p>
                    <p className="text-xs text-muted-foreground">{cat.label}</p>
                  </div>
                  <span className="text-sm font-semibold text-foreground">₹{expense.amount.toLocaleString()}</span>
                  <button onClick={() => deleteExpense(expense.id)} className="p-1 hover:bg-destructive/10 rounded">
                    <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
