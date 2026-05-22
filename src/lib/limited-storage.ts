"use client";

import { useCallback } from "react";
import { useCustomers, useServices, useEstimates } from "./storage";
import { usePlan } from "@/components/PlanProvider";
import { CustomerFormData, ServiceFormData, EstimateFormData } from "@/types";

/**
 * Plan-limited storage hooks.
 * These wrap the core hooks and enforce Free Plan limits.
 * Page components should use these instead of the raw hooks.
 */

export function useLimitedCustomers() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useCustomers();
  const { canAdd, showUpgrade, remaining } = usePlan();

  const limitedAddCustomer = useCallback(
    (data: CustomerFormData) => {
      if (!canAdd("customers", customers.length)) {
        showUpgrade("customers");
        return null;
      }
      return addCustomer(data);
    },
    [canAdd, showUpgrade, customers.length, addCustomer]
  );

  return {
    customers,
    addCustomer: limitedAddCustomer,
    updateCustomer,
    deleteCustomer,
    remaining: remaining("customers", customers.length),
    atLimit: !canAdd("customers", customers.length),
  };
}

export function useLimitedServices() {
  const { services, addService, updateService, deleteService, toggleService } = useServices();
  const { canAdd, showUpgrade, remaining } = usePlan();

  const limitedAddService = useCallback(
    (data: ServiceFormData) => {
      if (!canAdd("services", services.length)) {
        showUpgrade("services");
        return null;
      }
      return addService(data);
    },
    [canAdd, showUpgrade, services.length, addService]
  );

  return {
    services,
    addService: limitedAddService,
    updateService,
    deleteService,
    toggleService,
    remaining: remaining("services", services.length),
    atLimit: !canAdd("services", services.length),
  };
}

export function useLimitedEstimates() {
  const { estimates, addEstimate, updateEstimate, deleteEstimate } = useEstimates();
  const { canAdd, showUpgrade, remaining } = usePlan();

  const limitedAddEstimate = useCallback(
    (data: EstimateFormData) => {
      if (!canAdd("quotes", estimates.length)) {
        showUpgrade("quotes");
        return null;
      }
      return addEstimate(data);
    },
    [canAdd, showUpgrade, estimates.length, addEstimate]
  );

  return {
    estimates,
    addEstimate: limitedAddEstimate,
    updateEstimate,
    deleteEstimate,
    remaining: remaining("quotes", estimates.length),
    atLimit: !canAdd("quotes", estimates.length),
  };
}